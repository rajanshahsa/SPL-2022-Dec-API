import * as request from 'request';
import * as HmacSHA384 from 'crypto-js/hmac-sha384';
import { Constants } from '../config/constants';
import { Log } from './logger';
import { SendEmail } from './sendEmail';
import { Response } from 'aws-sdk';
import moment = require('moment');

export class CDKServer {
    static token;
    static customerId;
    static customerPassword;
    static rooftopId;


    private static setOptionsData(url, method, body, isJson, hashRequired = false, tokenRequired = true, registerCustomer = false) {
        let headers;
        const token = CDKServer.token;
        let hash;
        if (tokenRequired) {
            headers = {
                Authorization: `${process.env.AUTHORIZATION_PREFIX}Token ${token}`,
            };
        }
        if (hashRequired) {
            const hmac = HmacSHA384(CDKServer.token, process.env.SHARED_KEY);
            if (registerCustomer) {
                hash = Buffer.from(
                    `${CDKServer.customerId}:${hmac}`
                ).toString('base64');
            } else {
                hash = Buffer.from(
                    `${CDKServer.customerId}:${hmac}:${CDKServer.customerPassword}`
                ).toString('base64');
            }
            headers = {
                Authorization: `${process.env.AUTHORIZATION_PREFIX}Hash ${hash}`,
            };
        }
        const options: any = { method, url, body, json: isJson };
        if (tokenRequired || hashRequired) {
            options.headers = headers;
            return options;
        }
        return options;
    }

    public static requestToken(customerData?, isRegister = false) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.REQUEST_TOKEN}`;
            const bodyData = {
                CustomerId: customerData.customerId ? customerData.customerId : process.env.CUSTOMER_ID,
                PartnerId: process.env.PARTNER,
                Version: process.env.VERSION,
            }
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, bodyData, true, false, false);
            request(options, async (error: any, response: any, body: any) => {
                if (response) {
                    CDKServer.token = response.body.Token;
                    CDKServer.customerId = customerData.customerId;
                    CDKServer.customerPassword = process.env.CUSTOMER_PASSWORD;
                    CDKServer.rooftopId = customerData.rooftopId || process.env.ROOFTOP_ID;
                    if (!isRegister) {
                        const res = await this.checkPassword();
                        if (!res) {
                            resolve({ isActive: false });
                        } else {
                            resolve({ isActive: true, isSuccess: true });
                        }
                    }
                    resolve({
                        statusCode: response.statusCode,
                        isSuccess: true,
                        isActive: true
                    });
                } else {
                    Log.getLogger().error(`requestToken ${error}`);
                    SendEmail.sendRawMail(
                        null,
                        null,
                        [process.env.EXCEPTION_MAIL],
                        `CDK - Request Token - ERROR (${process.env.NODE_ENV})`,
                        JSON.stringify(response.body)
                    );
                    resolve(false);
                    return error;
                }
            });
        });
    }

    public static checkPassword() {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.CHECK_PASSWORD}`;
            const bodyData = {
                RooftopId: CDKServer.rooftopId,
            }
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, bodyData, true, true, false);
            request(options, async (error: any, response: any, body: any) => {
                if (response.body.ErrorCode === 0) {
                    resolve({
                        statusCode: response.statusCode,
                        isSuccess: true,
                    });
                } else {
                    Log.getLogger().error(`Check Password ${error}`);
                    SendEmail.sendRawMail(
                        null,
                        null,
                        [process.env.EXCEPTION_MAIL],
                        `CDK - Check Password - ERROR (${process.env.NODE_ENV})`,
                        JSON.stringify(response.body)
                    );
                    resolve(false);
                }
            });
        });
    }

    public static getChasisPrepopulation(vehicleDetail) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.CHASIS_PRE_POPULATION}`;
            const bodyData = {
                RooftopId: process.env.ROOFTOP_ID,
                CustomerId: CDKServer.customerId,
                ...vehicleDetail,
            }
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, bodyData, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    const {
                        VIN,
                        MakeCode,
                        ModelCode,
                        VariantCode,
                        ModelName,
                        RegNumber,
                    } = response.body.VehicleSpecDetails.VolVehicleDetails[0];
                    const vehicleModelYear: any = await this.GetMakeModelVariant(
                        MakeCode,
                        ModelCode,
                        VariantCode,
                        VIN
                    );
                    if (vehicleModelYear) {
                        resolve({
                            VIN,
                            MakeCode,
                            ModelCode,
                            VariantCode,
                            ModelYear: vehicleModelYear.ModelYear,
                            RegNumber,
                            ModelName,
                            isSuccess: true,
                        });
                    } else {
                        resolve(false);
                    }
                } else {
                    SendEmail.sendRawMail(
                        null,
                        null,
                        [process.env.EXCEPTION_MAIL],
                        `CDK - Get chasis prepopulation - ERROR (${process.env.NODE_ENV})`,
                        JSON.stringify({ response: response.body, data: bodyData })
                    );
                    resolve(false);
                    return error;
                }
            });
        });
    }

    public static GetMakeModelVariant(MakeCode, ModelCode, VariantCode, VIN) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.GET_MAKE_MODEL_VARIANT}`;
            const bodyData = {
                RooftopId: process.env.ROOFTOP_ID,
                MakeCode,
                ModelCode,
                GetMakeFlag: false,
                GetModelFlag: false,
                GetVariantFlag: true,
                GetAllFlag: false,
            }
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, bodyData, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    const modelYear = response.body.Results.MakeModelData.filter((vehicleDetail) => {
                        if (vehicleDetail.VariantCode === VariantCode) {
                            return vehicleDetail.ModelYear;
                        }
                    });
                    resolve({
                        ModelYear: modelYear[0].ModelYear,
                    });
                } else {
                    Log.getLogger().error(`GetMakeModelVariant ${error}`);
                    SendEmail.sendRawMail(
                        null,
                        null,
                        [process.env.EXCEPTION_MAIL],
                        `CDK - Get make model variant - ERROR (${process.env.NODE_ENV})`,
                        JSON.stringify({ response: response.body, data: bodyData })
                    );
                    resolve(false);
                }
            });
        });
    }

    public static getRecommendedServices(data) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.GET_RECOMMENDED_SERVICE}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, data, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    const serviceData = response.body.Results.PriceListData;
                    resolve(serviceData);
                } else {
                    Log.getLogger().error(`Get Recommended Services ${error}`);
                    resolve(false);
                }
            });
        });
    }

    public static getAppointmentDates(data) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.GET_APPOINTMENT_DATES}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, data, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    const { WorksDiary, NonWorkingDates } = response.body;
                    const result = {
                        availableDates: WorksDiary,
                        nonWorkingDates: NonWorkingDates,
                    }
                    resolve(result);
                } else {
                    Log.getLogger().error(`Get Appointment Dates ${response.body.Result.ErrorCode}`);
                    resolve(false);
                }
            });
        });
    }

    public static getAppointmentTime(data) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.GET_APPOINTMENT_TIME}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, data, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    const { TimeCode, OptionID, OptionAdvisor, SecondAppTimeRequired } = response.body.Option[0];
                    const newTimeCode = TimeCode.map(time => {
                        return time.split("-")[0];
                    })
                    const obj = {
                        availableTime: newTimeCode,
                        transportMethod: OptionID,
                        secondAppTimeRequired: SecondAppTimeRequired,
                        advisorOption: OptionAdvisor
                    }
                    resolve(obj);
                } else {
                    Log.getLogger().error(`Get Appointment Time ${response.body.ErrorCode}`);
                    resolve(false);
                }
            });
        });
    }

    public static getListOfAppointments(data, timeZone) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.GET_LIST_OF_APPOINTMENTS}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, data, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    const customerAppointments = response.body.CustomerAppointments.filter(
                        (appointment: Json) => `${appointment.JobDate} ${appointment.FirstAppTime}` >= moment().utcOffset(timeZone).format(Constants.DATE_HOUR_MINUTE_FORMAT)
                    );;
                    resolve(customerAppointments);
                } else {
                    Log.getLogger().error(`Get Customer Appointments ${error}`);
                    resolve(false);
                }
            });
        });
    }

    public static getAppointmentCanBeAmended(data) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.GET_LIST_OF_APPOINTMENTS}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, data, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    const CanBeAmended = response.body.CustomerAppointments[0].CanBeAmended;
                    if (CanBeAmended) {
                        resolve(true);
                    }
                    resolve(false);
                } else {
                    Log.getLogger().error(`Get Customer Appointments ${error}`);
                    resolve(false);
                }
            });
        });
    }

    public static addAppointment(data: any) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.ADD_APPOINTMENT}`;
            const obj = {
                RooftopId: data.RooftopId,
                CustomerId: CDKServer.customerId
            }
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, obj, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    resolve(response.body.AppointmentId);
                } else {
                    Log.getLogger().error(`Add Appointment ${response.body.ErrorCode}`);
                    resolve(false);
                }
            });
        });
    }

    public static getAdvisors(data: any) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.GET_SERVICE_ADVISORS}`;
            const obj = {
                RooftopId: data.RooftopId,
                TransportMethod: data.TransportMethod,
                AppointmentDate: data.JobDate,
                DropOffTime: data.DropOffTime
            }
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, obj, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    const { AdvisorData } = response.body.Results;
                    resolve(AdvisorData);
                } else {
                    Log.getLogger().error(`Get Advisors ${response.body.ErrorCode}`);
                    resolve(false);
                }
            });
        });
    }

    public static updateAppointment(data: any) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.UPDATE_APPOINTMENT}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, data, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response.body.ErrorCode === 0) {
                    resolve(true);
                } else {
                    Log.getLogger().error(`Update Appointment ${response.body.ErrorCode}`);
                    resolve(false);
                }
            });
        });
    }

    public static confirmAppointment(data: any) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.CONFIRM_APPOINTMENT}`;
            const obj = {
                AppointmentId: data.AppointmentId,
                CustomerId: data.CustomerId,
                SendConfirmationMail: false,
                RooftopId: data.RooftopId
            }
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, obj, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    resolve(response.body.WipNo);
                } else {
                    Log.getLogger().error(`Confrim Appointment ${response.body.ErrorCode}`);
                    resolve(false);
                }
            });
        });
    }

    public static deleteAppointment(data) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.DELETE_APPOINTMENT}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, data, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    resolve(true);
                } else {
                    Log.getLogger().error(`DElete Appointment ${JSON.stringify(response)}`);
                    resolve(false);
                }
            });
        });
    }

    public static activeToken() {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.ACTIVE_TOKEN}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, {}, true, true, false, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response.body.ErrorCode === 0) {
                    resolve(true);
                } else {
                    Log.getLogger().error(`Active Token ${response.body.ErrorCode}`);
                    resolve(false);
                }
            });
        });
    }

    public static registerCustomer(data) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.REGISTER_CUSTOMER}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, data, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response.body.ErrorCode === 0) {
                    resolve({ isSucess: true });
                } else {
                    const tmperror = { ...response.body, ...data }
                    SendEmail.sendRawMail(
                        null,
                        null,
                        [process.env.EXCEPTION_MAIL],
                        `CDK - Register Customer - ERROR (${process.env.NODE_ENV})`,
                        JSON.stringify(response.body)
                    );
                    Log.getLogger().error(`Register Customer ${response.body}`);
                    resolve({ isSucess: false, errorCode: response.body.ErrorCode });
                }
            });
        });
    }

    public static updateCustomer(data) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.UPDATE_CUSTOMER_INFO}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, data, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response.body.ErrorCode === 0) {
                    resolve({ isSucess: true });
                } else {
                    SendEmail.sendRawMail(
                        null,
                        null,
                        [process.env.EXCEPTION_MAIL],
                        `CDK - Register Customer - ERROR (${process.env.NODE_ENV})`,
                        JSON.stringify(response.body)
                    );
                    Log.getLogger().error(`Update Customer ${response.body}`);
                    resolve({ isSucess: false, errorCode: response.body.ErrorCode });
                }
            });
        });
    }

    public static registerUserVehicle(data) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.ADD_CUSTOMER_VEHICLE}`;
            const obj = {
                RooftopId: CDKServer.rooftopId,
                CustomerId: CDKServer.customerId,
                MakeCode: data.MakeCode,
                ModelCode: data.ModelCode,
                VariantCode: data.MakeCode,
                RegistrationNumber: data.RegNumber,
            }
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, obj, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response && response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    resolve({ vehicleId: response.body.VehicleId });
                } else {
                    SendEmail.sendRawMail(
                        null,
                        null,
                        [process.env.EXCEPTION_MAIL],
                        `CDK - Register Customer vehicle - ERROR (${process.env.NODE_ENV})`,
                        JSON.stringify(response.body)
                    );
                    Log.getLogger().error(`Register Customer Vehicle ${response.body}`);
                    resolve(false);
                }
            });
        });
    }

    public static deleteUserVehicle(data) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.DELETE_CUSTOMER_VEHICLE}`;
            const obj = {
                RooftopId: CDKServer.rooftopId,
                CustomerId: CDKServer.customerId,
                VehicleId: +data.solVehicleId,
            }
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, obj, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response.body.ErrorCode === 0) {
                    resolve(true);
                } else {
                    SendEmail.sendRawMail(
                        null,
                        null,
                        [process.env.EXCEPTION_MAIL],
                        `CDK - Delete Customer vehicle - ERROR (${process.env.NODE_ENV})`,
                        JSON.stringify(response.body)
                    );
                    Log.getLogger().error(`Delete Customer Vehicle ${JSON.stringify(response.body)}`);
                    resolve(false);
                }
            });
        });
    }

    public static getCustomerDetails(data) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.CDK_BASE_URL}${process.env.COMMUNITY_ID}${Constants.CDK_URLS.GET_CUSTOMER_INFO}`;
            const options = await this.setOptionsData(requestURL, Constants.API_METHOD.POST, data, true);
            request(options, async (error: any, response: any, body: any) => {
                if (response.body && response.body.Result && response.body.Result.ErrorCode === 0) {
                    resolve(response.body.CustomerInformationResult);
                } else {
                    SendEmail.sendRawMail(
                        null,
                        null,
                        [process.env.EXCEPTION_MAIL],
                        `CDK - Register Customer - ERROR (${process.env.NODE_ENV})`,
                        JSON.stringify(response.body)
                    );
                    Log.getLogger().error(`Update Customer ${response.body}`);
                    resolve({ isSucess: false, errorCode: response.body.ErrorCode });
                }
            });
        });
    }
}
