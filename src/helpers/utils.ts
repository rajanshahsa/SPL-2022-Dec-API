import PhoneNumber from 'awesome-phonenumber';
import * as moment from 'moment';
import { Constants } from '../config/constants';
import {
  Tables,
  ModuleTable,
  AudienceTable,
  DeviceTable,
  UserTable,
  UserVehicleTable,
  UserHobbyTable,
  UserAudienceTable,
  OrderTable,
  PaymentRequestTable,
  VehicleDepositeTrackingTable,
  TierDetailsTable,
  SurveyTable,
  SurveyDetailsTable,
  HomeServicesDetailsTable,
  HomeServiceTable,
  SpecialOfferTable,
  SubModuleTable,
  VehicleDetailTable,
  VehicleTable,
  LoyaltySpecialOfferTable,
  LoyaltySpecialOfferDetailTable,
} from '../config/tables';
import * as mysql from 'jm-ez-mysql';
import { ResponseBuilder } from './responseBuilder';
import { isEmpty, map } from 'lodash';
import { NotificationUtil } from './notificationUtils';

export class Utils {
  /** Creating 6 digit random code for otp as well as referral code */
  public static createRandomcode = (length: number, isOTP: boolean) => {
    let code = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // for referral code generator
    if (isOTP) {
      characters = '0123456789'; // for otp generator
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
  };

  /** Format mobile number to e164 */
  public static formatPhoneNumber = (phoneNumber: string) => {
    const mobile = new PhoneNumber(phoneNumber, process.env.DEFAULT_COUNTRY_CODE);
    return mobile.getNumber('e164');
  };

  /** Get start and end time of day in particular format  */
  public static getDayStartAndEndTime = (date: string) => {
    return {
      startDate: moment(date)
        .startOf('day')
        .format(Constants.DATA_BASE_DATE_TIME_FORMAT),
      endDate: moment(date)
        .endOf('day')
        .format(Constants.DATA_BASE_DATE_TIME_FORMAT),
    };
  };

  /** Get start and end time of start and end date in particular format  */
  public static getStartAndEndDates = (startDate: string, endDate: string) => {
    return {
      startDate: moment(startDate)
        .startOf('day')
        .format(Constants.DATA_BASE_DATE_TIME_FORMAT),
      endDate: moment(endDate)
        .endOf('day')
        .format(Constants.DATA_BASE_DATE_TIME_FORMAT),
    };
  };

  /** convert date into ISO string */
  public static convertedTOISOString = (date: string) => {
    return date.replace(' ', 'T');
  };

  /** convert returned string from sql result to array by seperating comma */
  public static formatStringToArray = (result: any, type: string) => {
    if (result[type]) {
      if (result[type].indexOf(',') > 0) {
        result[type] = result[type].split(',');
      } else {
        result[type] = [result[type]];
      }
    } else {
      result[type] = [];
    }
    return result[type];
  };

  /** convert returned string object from sql result to array of objects */
  public static formatStringObjectsToArrayObjects = (result: any, type: string) => {
    if (result[type]) {
      result[type] = JSON.parse(result[type]);
    } else {
      result[type] = [];
    }
    return result[type];
  };

  /** convert dollar to cents */
  public static convertToCents = (amount: number) => {
    return amount * 100;
  };

  /** convert dollar to cents */
  public static convertFloatNumberToString = (amount: any) => {
    return parseFloat(amount).toFixed(2);
  };

  /** Get start and end time of day in particular format  */
  public static getMonthStartAndEndTime = (month: number) => {
    return {
      startDate: moment(month, 'MM')
        .startOf('month')
        .format(Constants.DATA_BASE_DATE_TIME_FORMAT),
      endDate: moment(month, 'MM')
        .endOf('month')
        .format(Constants.DATA_BASE_DATE_TIME_FORMAT),
    };
  };
  /** Get difference between two dates as days  */
  public static getDifferenceOfDates = (
    startDate: string,
    endDate: string,
    asHours: boolean = false
  ) => {
    let start: any;
    let end: any;
    // Difference in number of days/hours
    if (asHours) {
      start = moment(startDate, Constants.DATA_BASE_DATE_TIME_FORMAT);
      end = moment(endDate, Constants.DATA_BASE_DATE_TIME_FORMAT);
      return moment.duration(start.diff(end)).asHours();
    } else {
      start = moment(startDate, Constants.DATE_FORMAT);
      end = moment(endDate, Constants.DATE_FORMAT);
      return moment.duration(start.diff(end)).asDays();
    }
  };

  /** Get Time slot of a working day with given interval */
  public static getTimeSlots = (startTime: number, endTime: number, interval: number) => {
    const timeSlots = [];
    let start: any = moment(`${startTime}:00`, Constants.TIME_HOUR_MINUTE_FORMAT).format(
      Constants.TIME_HOUR_MINUTE_FORMAT
    );

    const loop = (endTime - startTime) * (60 / interval);

    for (let i = 1; i <= loop; i++) {
      const endOfStart = moment(start, Constants.TIME_HOUR_MINUTE_FORMAT)
        .add(interval, 'minutes')
        .format(Constants.TIME_HOUR_MINUTE_FORMAT);
      timeSlots.push(`${start}-${endOfStart}`);
      start = endOfStart;
    }
    return timeSlots;
  };

  public static capitalizeString(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  public static getIpAddress(req) {
    return req.headers.remoteAddress || req.connection.remoteAddress || '';
  }

  public static async getModuleId(moduleName) {
    return await mysql.first(
      Tables.MODULE,
      [ModuleTable.ID, ModuleTable.IS_ENABLE],
      `${ModuleTable.NAME} = '${moduleName}'`
    );
  }

  public static async getSubModuleId(moduleName) {
    return await mysql.first(
      Tables.SUBMODULE,
      [SubModuleTable.ID],
      `${SubModuleTable.NAME} = '${moduleName}'`
    );
  }

  public static async refreshAudiences(staffId): Promise<ResponseBuilder> {
    const getAllAudiences = await mysql.findAll(
      Tables.AUDIENCES,
      [AudienceTable.ID],
      `${AudienceTable.IS_DELETE} = 0`
    );

    // tslint:disable-next-line: prefer-for-of
    for (let n = 0; n < getAllAudiences.length; n++) {
      Utils.specialOfferForAll(staffId, getAllAudiences[n].id);
    }

    return ResponseBuilder.data({ refreshed: true });
  }

  public static specialOfferForAll = async (staffId, audienceId) => {
    const getAudience = await mysql.first(Tables.AUDIENCES, ['*'], `${AudienceTable.ID} = ?`, [
      audienceId,
    ]);
    if (
      !getAudience.usersCreatedStartDate &&
      !getAudience.vehicleModels &&
      !getAudience.vehicleYears &&
      !getAudience.hobbies &&
      !getAudience.birthdateStartDate &&
      !getAudience.unreadNotificationCount &&
      getAudience.deviceType === 'both'
    ) {
      const getAllUserDevices = await mysql.findAll(Tables.DEVICE, [DeviceTable.ID], '1=1');
      await Utils.insertUserInAudienceByLoop(staffId, audienceId, getAllUserDevices, true);
    } else {
      if (
        getAudience &&
        !isEmpty(getAudience.usersCreatedStartDate) &&
        !isEmpty(getAudience.usersCreatedEndDate)
      ) {
        const whereClause = `DATE(${UserTable.CREATED_AT}) >= '${moment(
          getAudience.usersCreatedStartDate
        )
          .startOf('day')
          .format(Constants.DATA_BASE_DATE_FORMAT)}'
            AND DATE(${UserTable.CREATED_AT}) <= '${moment(getAudience.usersCreatedEndDate)
          .endOf('day')
          .format(Constants.DATA_BASE_DATE_FORMAT)}'`;
        const getUsers = await mysql.findAll(
          Tables.USER,
          [UserTable.MOBILE_NUMBER, UserTable.EMAIL],
          `${whereClause}`
        );
        if (getUsers.length > 0) {
          await Utils.insertUserInAudienceByLoop(staffId, audienceId, getUsers);
        }
      }
      if (
        getAudience &&
        !isEmpty(getAudience.birthdateStartDate) &&
        !isEmpty(getAudience.birthdateStartDate)
      ) {
        const whereClause = `${UserTable.BIRTH_DATE} >= '${moment(
          getAudience.birthdateStartDate,
          Constants.DATA_BASE_DATE_FORMAT
        )
          .startOf('day')
          .format(Constants.DATE_FORMAT)}'
            AND ${UserTable.BIRTH_DATE} <= '${moment(
          getAudience.usersCreatedEndDate,
          Constants.DATA_BASE_DATE_FORMAT
        )
          .endOf('day')
          .format(Constants.DATE_FORMAT)}'`;
        const getUsers = await mysql.findAll(
          Tables.USER,
          [UserTable.MOBILE_NUMBER, UserTable.EMAIL],
          `${whereClause}`
        );
        if (getUsers.length > 0) {
          await Utils.insertUserInAudienceByLoop(staffId, audienceId, getUsers);
        }
      }
      if (getAudience && !isEmpty(getAudience.vehicleModels)) {
        const getUserByVehicleModels = await mysql.findAll(
          `${Tables.USER} u LEFT JOIN ${Tables.USER_VEHICLE} uv ON u.${UserTable.ID} = uv.${UserVehicleTable.USER_ID}`,
          [`u.${UserTable.MOBILE_NUMBER}`, `u.${UserTable.EMAIL}`],
          `FIND_IN_SET(uv.${UserVehicleTable.VEHICLE_MODAL}, '${getAudience.vehicleModels}')`
        );
        if (getUserByVehicleModels.length > 0) {
          await Utils.insertUserInAudienceByLoop(staffId, audienceId, getUserByVehicleModels);
        }
      }
      if (getAudience && !isEmpty(getAudience.vehicleYears)) {
        const getUserByVehicleYears = await mysql.findAll(
          `${Tables.USER} u LEFT JOIN ${Tables.USER_VEHICLE} uv ON u.${UserTable.ID} = uv.${UserVehicleTable.USER_ID}`,
          [`u.${UserTable.MOBILE_NUMBER}`, `u.${UserTable.EMAIL}`],
          `FIND_IN_SET(uv.${UserVehicleTable.MODAL_YEAR}, '${getAudience.vehicleYears}')`
        );
        if (getUserByVehicleYears.length > 0) {
          await Utils.insertUserInAudienceByLoop(staffId, audienceId, getUserByVehicleYears);
        }
      }
      if (getAudience && !isEmpty(getAudience.hobbies)) {
        const getUserByHobbies = await mysql.findAll(
          `${Tables.USER} u LEFT JOIN ${Tables.USER_HOBBIES} uh ON u.${UserTable.ID} = uh.${UserHobbyTable.USER_ID}`,
          [`u.${UserTable.MOBILE_NUMBER}`, `u.${UserTable.EMAIL}`],
          `FIND_IN_SET(uh.${UserHobbyTable.HOBBY_ID}, '${getAudience.hobbies}')`
        );
        if (getUserByHobbies.length > 0) {
          await Utils.insertUserInAudienceByLoop(staffId, audienceId, getUserByHobbies);
        }
      }
      if (getAudience && !isEmpty(getAudience.deviceType)) {
        let getUserByDeviceType = null;
        if (getAudience.deviceType === 'ios') {
          getUserByDeviceType = await mysql.findAll(
            `${Tables.USER} u LEFT JOIN ${Tables.DEVICE} d ON u.${UserTable.ID} = d.${DeviceTable.USER_ID}`,
            [`u.${UserTable.MOBILE_NUMBER}`, `u.${UserTable.EMAIL}`],
            `d.${DeviceTable.DEVICE_TYPE} = '${Constants.DEVICE_TYPE.IOS}'`
          );
        }
        if (getAudience.deviceType === 'android') {
          getUserByDeviceType = await mysql.findAll(
            `${Tables.USER} u LEFT JOIN ${Tables.DEVICE} d ON u.${UserTable.ID} = d.${DeviceTable.USER_ID}`,
            [`u.${UserTable.MOBILE_NUMBER}`, `u.${UserTable.EMAIL}`],
            `d.${DeviceTable.DEVICE_TYPE} = '${Constants.DEVICE_TYPE.ANDROID}'`
          );
        }
        if (getUserByDeviceType && getUserByDeviceType.length > 0) {
          await Utils.insertUserInAudienceByLoop(staffId, audienceId, getUserByDeviceType);
        }
      }
    }
  };

  public static insertUserInAudience = async (staffId, deviceId, audienceId) => {
    const audienceDetail = {
      deviceId,
      audienceId,
      createdBy: staffId,
    };
    const getUserInAudience = await mysql.first(
      Tables.USER_AUDIENCES,
      [UserAudienceTable.ID],
      `${UserAudienceTable.AUDIENCE_ID} = ${audienceId}
        AND ${UserAudienceTable.DEVICE_ID} = ${deviceId}`
    );
    if (getUserInAudience && getUserInAudience.id) {
      return false;
    }
    return await mysql.insert(Tables.USER_AUDIENCES, audienceDetail);
  };

  public static getDeviceId = async (mobile, email) => {
    const whereClause = `u.${UserTable.MOBILE_NUMBER} = '${mobile}' OR u.${UserTable.EMAIL} = '${email}'`;
    const device = await mysql.first(
      `${Tables.USER} u LEFT JOIN ${Tables.DEVICE} d ON u.${UserTable.ID} = d.${DeviceTable.USER_ID}`,
      [`d.${DeviceTable.ID}`],
      whereClause
    );
    return device.id;
  };

  public static insertUserInAudienceByLoop = async (
    staffId,
    audienceId,
    userArray,
    deviceStatus = false
  ) => {
    const lengthOfArray = userArray.length;
    if (deviceStatus) {
      for (let i = 0; i < lengthOfArray; i++) {
        await Utils.insertUserInAudience(staffId, userArray[i].id, audienceId);
      }
    } else {
      for (let n = 0; n < lengthOfArray; n++) {
        const getDeviceId = await Utils.getDeviceId(userArray[n].mobileNumber, userArray[n].email);
        if (getDeviceId) {
          await Utils.insertUserInAudience(staffId, getDeviceId, audienceId);
        }
      }
    }
  };

  public static updateLoyaltyPoints = async (
    redeemedLoyaltyPoints: number = 0,
    type: string,
    id: number,
    userId: number,
    getLoyaltyPoints: number = 0,
    claimedLoyaltyPoints: number = 0
  ) => {
    const module = await Utils.getModuleId(Constants.REDIRECT_MODULE_IDS.LOYALTY);
    if (module && module.isEnable) {
      let table: string;
      let whereClause: string;
      let moduleId: number;
      const attributes: any = {
        redeemedLoyaltyPoints,
      };
      if (type === Constants.LOYALTY_TYPES.HOME_SERVICE) {
        table = `${Tables.ORDERS}`;
        whereClause = `${OrderTable.ID} = ${id}`;
        if (claimedLoyaltyPoints) {
          attributes.claimedLoyaltyPoints = claimedLoyaltyPoints;
        } else if (getLoyaltyPoints) {
          attributes.claimedLoyaltyPoints = getLoyaltyPoints;
        }
        const module = await Utils.getModuleId(Constants.REDIRECT_MODULE_IDS.HOMESERVICES);
        moduleId = module.id;
      }
      if (type === Constants.LOYALTY_TYPES.MAKE_PAYMENT) {
        table = `${Tables.PAYMENT_REQUESTS}`;
        whereClause = `${PaymentRequestTable.ID} = ${id}`;
        const module = await Utils.getModuleId(Constants.REDIRECT_MODULE_IDS.PAYMENT);
        moduleId = module.id;
      }
      if (type === Constants.LOYALTY_TYPES.VEHICLE_DOWN_PAYMENT) {
        table = `${Tables.VEHICLE_DEPOSIT_TRACKING}`;
        whereClause = `${VehicleDepositeTrackingTable.PAYMENT_ORDER_ID} = ${id}`;
        const module = await Utils.getModuleId(Constants.REDIRECT_MODULE_IDS.NEW);
        moduleId = module.id;
      }
      if (type === Constants.LOYALTY_TYPES.VEHICLE_DOWN_PAYMENT_COD) {
        table = `${Tables.VEHICLE_DEPOSIT_TRACKING}`;
        whereClause = `${VehicleDepositeTrackingTable.ID} = ${id}`;
        const module = await Utils.getModuleId(Constants.REDIRECT_MODULE_IDS.NEW);
        moduleId = module.id;
      }
      if (getLoyaltyPoints) {
        await mysql.query(`UPDATE ${Tables.USER}
          SET ${UserTable.LIFE_TIME_EARNED_POINTS} = ${UserTable.LIFE_TIME_EARNED_POINTS} + ${getLoyaltyPoints},
          ${UserTable.CURRENT_POINTS} = ${UserTable.CURRENT_POINTS} + ${getLoyaltyPoints}
          WHERE ${UserTable.ID} = ${userId}`);

        const getUserDetail = await mysql.first(
          Tables.USER,
          [UserTable.TIER_ID, UserTable.CURRENT_POINTS],
          `${UserTable.ID}=${userId}`
        );

        const getTierDetail = await mysql.first(
          Tables.TIER_DETAILS,
          [TierDetailsTable.ID, TierDetailsTable.MIN_POINTS_EARNED],
          `${TierDetailsTable.IS_ENABLE} = 1
          AND ${TierDetailsTable.MIN_POINTS_EARNED} <= ${getUserDetail.currentPoints}
          ORDER BY ${TierDetailsTable.MIN_POINTS_EARNED} DESC`
        );

        if (getTierDetail) {
          await mysql.updateFirst(
            Tables.USER,
            { tierId: getTierDetail.id },
            `${UserTable.ID}=${userId}`
          );
        }
      }
      if (!claimedLoyaltyPoints) {
        await mysql.query(`UPDATE ${Tables.USER}
    SET ${UserTable.CURRENT_POINTS} = ${UserTable.CURRENT_POINTS} - ${redeemedLoyaltyPoints},
    ${UserTable.TOTAL_REDEMPTION} = ${UserTable.TOTAL_REDEMPTION} + ${redeemedLoyaltyPoints}
    WHERE ${UserTable.ID} = ${userId}`);
      }

      if (getLoyaltyPoints || redeemedLoyaltyPoints) {
        const loyaltyDetails = {
          userId,
          moduleId,
          addedPoint: getLoyaltyPoints,
          redeemedPoint: redeemedLoyaltyPoints,
          createdBy: userId,
        };

        await mysql.insert(Tables.LOYALTY_DETAILS, loyaltyDetails);
      }

      await mysql.updateFirst(table, attributes, whereClause);

      return;
    }
  };

  public static getUserTier = async (userId) => {
    const getUserDetail = await mysql.first(
      Tables.USER,
      [UserTable.TIER_ID, UserTable.CURRENT_POINTS],
      `${UserTable.ID}=${userId}`
    );

    const getTierDetail = await mysql.first(
      Tables.TIER_DETAILS,
      [TierDetailsTable.ID, TierDetailsTable.MIN_POINTS_EARNED],
      `${TierDetailsTable.IS_ENABLE} = 1
        AND ${TierDetailsTable.MIN_POINTS_EARNED} <= ${getUserDetail.currentPoints}
        ORDER BY ${TierDetailsTable.MIN_POINTS_EARNED} DESC`
    );

    return getTierDetail.id;
  };

  public static sendNotificationUsingSurveyTriggerPoint = async (userId, triggerPont) => {
    const module = await Utils.getModuleId(Constants.REDIRECT_MODULE_IDS.SURVEY);
    if (module && module.isEnable) {
      switch (triggerPont) {
        case Constants.SURVEY_TRIGGER_POINTS.HOME_SERVICE_COMPLETED:
          await Utils.getSurveyDetailsAndSendPushNotification(userId, triggerPont);
          break;
        case Constants.SURVEY_TRIGGER_POINTS.SERVICE_COMPLETED:
          await Utils.getSurveyDetailsAndSendPushNotification(userId, triggerPont);
          break;
        case Constants.SURVEY_TRIGGER_POINTS.TEST_DRIVE_COMPLETED:
          await Utils.getSurveyDetailsAndSendPushNotification(userId, triggerPont);
          break;
        case Constants.SURVEY_TRIGGER_POINTS.FEEDBACK_CLOSED:
          await Utils.getSurveyDetailsAndSendPushNotification(userId, triggerPont);
          break;
        case Constants.SURVEY_TRIGGER_POINTS.LIVE_CHAT_COMPLETED:
          await Utils.getSurveyDetailsAndSendPushNotification(userId, triggerPont);
          break;
        case Constants.SURVEY_TRIGGER_POINTS.MAKE_PAID_PAYMENT:
          await Utils.getSurveyDetailsAndSendPushNotification(userId, triggerPont);
          break;
        default:
          break;
      }
    }
  };

  public static getSurveyDetailsAndSendPushNotification = async (userId, triggerPont) => {
    const getTriggeredSurveyDetail = await mysql.first(
      `${Tables.SURVEYS} s
            LEFT JOIN ${Tables.SURVEYS_DETAILS} sd ON s.${SurveyTable.ID} = sd.${SurveyDetailsTable.SURVEY_ID}
            AND sd.${SurveyDetailsTable.LANGUAGE_ID} = ${Constants.LANGUAGES.en.value}`,
      [`s.${SurveyTable.ID}`, `sd.${SurveyDetailsTable.TITLE}`],
      `s.${SurveyTable.TRIGGER_POINT} = '${triggerPont}'
        AND s.${SurveyTable.IS_DELETED} = 0`
    );
    if (getTriggeredSurveyDetail) {
      const module = await Utils.getModuleId(Constants.REDIRECT_MODULE_IDS.SURVEY);
      const payload = {
        receiverId: userId,
        moduleId: module.id,
        moduleName: Constants.MODULE_NAMES.SURVEY,
        itemId: +getTriggeredSurveyDetail.id,
        createdBy: userId,
        subject: getTriggeredSurveyDetail.title,
        body: null,
      };

      await NotificationUtil.processPushNotification(
        userId,
        null,
        getTriggeredSurveyDetail.title,
        payload
      );
    }
  };

  public static getHomeServiceDiscountedPriceForSpecialOffer = async (
    homeServiceId,
    userTierId
  ) => {
    const discounted: any = {};
    const subMudule = await Utils.getSubModuleId(Constants.REDIRECT_MODULE_IDS.HOMESERVICES);
    const getHomeServiceFromExlusiveOffer = await mysql.first(
      `${Tables.LOYALTY_SPECIAL_OFFERS} lso
        LEFT JOIN ${Tables.LOYALTY_SPECIAL_OFFER_DETAILS} lsod
        ON lso.${LoyaltySpecialOfferTable.ID} = lsod.${LoyaltySpecialOfferDetailTable.SPECIAL_OFFER_ID}
        AND lsod.${LoyaltySpecialOfferDetailTable.LANGUAGE_ID} = ${Constants.LANGUAGES.en.value}`,
      [
        `lsod.${LoyaltySpecialOfferDetailTable.DISCOUNT_PERCENTAGE}`,
        `lsod.${LoyaltySpecialOfferDetailTable.SPECIAL_PRICE}`,
        `lso.${LoyaltySpecialOfferTable.TIER_IDS}`,
        `lso.${LoyaltySpecialOfferTable.ITEM_ID}`,
      ],
      `lso.${LoyaltySpecialOfferTable.MODULE_ID} = ${subMudule.id}
        AND lso.${LoyaltySpecialOfferTable.ITEM_ID} = ${+homeServiceId}
        AND lso.${LoyaltySpecialOfferTable.IS_ENABLE} = 1
        AND lso.${LoyaltySpecialOfferTable.IS_DELETE} = 0
        AND FIND_IN_SET(${userTierId}, lso.${LoyaltySpecialOfferTable.TIER_IDS})`
    );
    if (getHomeServiceFromExlusiveOffer) {
      const getHomeService = await mysql.first(
        `${Tables.HOME_SERVICES} hs
          LEFT JOIN ${Tables.HOME_SERVICES_DETAILS} hsd
          ON hsd.${HomeServicesDetailsTable.HOME_SERVICE_ID} = hs.${HomeServiceTable.ID}
          AND hsd.${HomeServicesDetailsTable.LANGUAGE_ID} = ${Constants.LANGUAGES.en.value}`,
        [`hs.${HomeServiceTable.ID}`, `hsd.${HomeServicesDetailsTable.PRICE}`],
        `hs.${HomeServiceTable.ID} = ${getHomeServiceFromExlusiveOffer.itemId}`
      );
      if (+getHomeServiceFromExlusiveOffer.discountPercentage) {
        discounted.price =
          +getHomeService.price -
          Math.round(
            (+getHomeService.price * +getHomeServiceFromExlusiveOffer.discountPercentage) / 100
          );
      } else if (+getHomeServiceFromExlusiveOffer.specialPrice) {
        discounted.price = +getHomeServiceFromExlusiveOffer.specialPrice;
      } else {
        discounted.price = +getHomeService.price;
      }
    }
    // else {
    //   const getHomeServiceFromSpecialOffer = await mysql.first(
    //     Tables.SPECIAL_OFFERS,
    //     [
    //       SpecialOfferTable.DISCOUNT_PERCENTAGE,
    //       SpecialOfferTable.AUDIENCE_ID,
    //       SpecialOfferTable.ITEM_ID,
    //     ],
    //     `${SpecialOfferTable.MODULE_ID} = ${subMudule.id}
    //       AND ${SpecialOfferTable.ITEM_ID} = ${+homeServiceId}
    //       AND ${SpecialOfferTable.IS_ENABLE} = 1
    //       AND ${SpecialOfferTable.IS_DELETE} = 0`
    //   );
    //   if (getHomeServiceFromSpecialOffer) {
    //     const getUserFromAudience = await mysql.first(
    //       `${Tables.USER_AUDIENCES} ua
    //       LEFT JOIN ${Tables.DEVICE} d ON ua.${UserAudienceTable.DEVICE_ID} = d.${DeviceTable.ID}
    //       LEFT JOIN ${Tables.USER} u ON u.${UserTable.ID} = d.${DeviceTable.USER_ID}`,
    //       ['COUNT(DISTINCT ua.id) as count'],
    //       `u.${UserTable.ID} = ${userId}
    //         AND ua.${UserAudienceTable.AUDIENCE_ID} = ${getHomeServiceFromSpecialOffer.audienceId}`
    //     );
    //     if (getUserFromAudience.count && getUserFromAudience.count > 0) {
    //       const getHomeService = await mysql.first(
    //         `${Tables.HOME_SERVICES} hs
    //         LEFT JOIN ${Tables.HOME_SERVICES_DETAILS} hsd
    //         ON hsd.${HomeServicesDetailsTable.HOME_SERVICE_ID} = hs.${HomeServiceTable.ID}
    //         AND hsd.${HomeServicesDetailsTable.LANGUAGE_ID} = ${Constants.LANGUAGES.en.value}`,
    //         [`hs.${HomeServiceTable.ID}`, `hsd.${HomeServicesDetailsTable.PRICE}`],
    //         `hs.${HomeServiceTable.ID} = ${getHomeServiceFromSpecialOffer.itemId}`
    //       );
    //       if (+getHomeServiceFromSpecialOffer.discountPercentage) {
    //         discounted.price = Math.round(
    //           (getHomeService.price * +getHomeServiceFromSpecialOffer.discountPercentage) / 100
    //         );
    //       }
    //     }
    //   }
    // }
    return discounted;
  };

  public static getVehicleDownPaymentDiscountedPriceForSpecialOffer = async (
    vehicleId,
    userTierId
  ) => {
    const discounted: any = {};
    const subMudule = await Utils.getSubModuleId(Constants.REDIRECT_MODULE_IDS.NEW_VEHICLE);
    const getVehicleDownPaymentFromExlusiveOffer = await mysql.first(
      `${Tables.LOYALTY_SPECIAL_OFFERS} lso
        LEFT JOIN ${Tables.LOYALTY_SPECIAL_OFFER_DETAILS} lsod
        ON lso.${LoyaltySpecialOfferTable.ID} = lsod.${LoyaltySpecialOfferDetailTable.SPECIAL_OFFER_ID}
        AND lsod.${LoyaltySpecialOfferDetailTable.LANGUAGE_ID} = ${Constants.LANGUAGES.en.value}`,
      [
        `lsod.${LoyaltySpecialOfferDetailTable.DISCOUNT_PERCENTAGE}`,
        `lsod.${LoyaltySpecialOfferDetailTable.SPECIAL_PRICE}`,
        `lso.${LoyaltySpecialOfferTable.TIER_IDS}`,
        `lso.${LoyaltySpecialOfferTable.ITEM_ID}`,
      ],
      `lso.${LoyaltySpecialOfferTable.MODULE_ID} = ${subMudule.id}
        AND lso.${LoyaltySpecialOfferTable.ITEM_ID} = ${+vehicleId}
        AND lso.${LoyaltySpecialOfferTable.IS_ENABLE} = 1
        AND lso.${LoyaltySpecialOfferTable.IS_DELETE} = 0
        AND FIND_IN_SET(${userTierId}, lso.${LoyaltySpecialOfferTable.TIER_IDS})`
    );
    if (getVehicleDownPaymentFromExlusiveOffer) {
      const getVehicle = await mysql.first(
        `${Tables.VEHICLE} v
            LEFT JOIN ${Tables.VEHICLE_DETAIL} vd
            ON vd.${VehicleDetailTable.VEHICLE_ID} = v.${VehicleTable.ID}
            AND vd.${VehicleDetailTable.LANGUAGE_ID} = ${Constants.LANGUAGES.en.value}`,
        [
          `v.${VehicleTable.ID}`,
          `vd.${VehicleDetailTable.PRICE}`,
          `vd.${VehicleDetailTable.DEPOSITE_AMOUNT}`,
        ],
        `v.${VehicleTable.ID} = ${getVehicleDownPaymentFromExlusiveOffer.itemId}`
      );
      if (+getVehicleDownPaymentFromExlusiveOffer.discountPercentage) {
        discounted.price =
          +getVehicle.price -
          Math.round(
            (+getVehicle.price * +getVehicleDownPaymentFromExlusiveOffer.discountPercentage) / 100
          );
        discounted.depositAmount =
          +getVehicle.depositAmount +
          Math.round(
            (+getVehicle.depositAmount *
              +getVehicleDownPaymentFromExlusiveOffer.discountPercentage) /
              100
          );
      } else if (+getVehicleDownPaymentFromExlusiveOffer.specialPrice) {
        discounted.price = +getVehicleDownPaymentFromExlusiveOffer.specialPrice;
        discounted.depositAmount = +getVehicleDownPaymentFromExlusiveOffer.specialPrice;
      } else {
        discounted.price = +getVehicle.price;
        discounted.depositAmount = +getVehicle.depositAmount;
      }
    }
    // else {
    //   const getVehicleDownPaymentFromSpecialOffer = await mysql.first(
    //     Tables.SPECIAL_OFFERS,
    //     [
    //       SpecialOfferTable.DISCOUNT_PERCENTAGE,
    //       SpecialOfferTable.AUDIENCE_ID,
    //       SpecialOfferTable.ITEM_ID,
    //     ],
    //     `${SpecialOfferTable.MODULE_ID} = ${subMudule.id}
    //     AND ${SpecialOfferTable.ITEM_ID} = ${+vehicleId}
    //     AND ${SpecialOfferTable.IS_ENABLE} = 1
    //     AND ${SpecialOfferTable.IS_DELETE} = 0`
    //   );
    //   if (getVehicleDownPaymentFromSpecialOffer) {
    //     const getUserFromAudience = await mysql.first(
    //       `${Tables.USER_AUDIENCES} ua
    //     LEFT JOIN ${Tables.DEVICE} d ON ua.${UserAudienceTable.DEVICE_ID} = d.${DeviceTable.ID}
    //     LEFT JOIN ${Tables.USER} u ON u.${UserTable.ID} = d.${DeviceTable.USER_ID}`,
    //       ['COUNT(DISTINCT ua.id) as count'],
    //       `u.${UserTable.ID} = ${userId}
    //       AND ua.${UserAudienceTable.AUDIENCE_ID} = ${getVehicleDownPaymentFromSpecialOffer.audienceId}`
    //     );
    //     if (getUserFromAudience.count && getUserFromAudience.count > 0) {
    //       const getVehicle = await mysql.first(
    //         `${Tables.VEHICLE} v
    //           LEFT JOIN ${Tables.VEHICLE_DETAIL} vd
    //           ON vd.${VehicleDetailTable.VEHICLE_ID} = v.${VehicleTable.ID}
    //           AND vd.${VehicleDetailTable.LANGUAGE_ID} = ${Constants.LANGUAGES.en.value}`,
    //         [
    //           `v.${VehicleTable.ID}`,
    //           `vd.${VehicleDetailTable.PRICE}`,
    //           `vd.${VehicleDetailTable.DEPOSITE_AMOUNT}`,
    //         ],
    //         `v.${VehicleTable.ID} = ${getVehicleDownPaymentFromSpecialOffer.itemId}`
    //       );
    //       if (+getVehicleDownPaymentFromSpecialOffer.discountPercentage) {
    //         discounted.price = Math.round(
    //           (getVehicle.price * +getVehicleDownPaymentFromSpecialOffer.discountPercentage) / 100
    //         );
    //         discounted.depositAmount = Math.round(
    //           (getVehicle.depositAmount *
    //             +getVehicleDownPaymentFromSpecialOffer.discountPercentage) /
    //             100
    //         );
    //       }
    //     }
    //   }
    // }
    return discounted;
  };

  public static getPreOwnedVehicleDownPaymentDiscountedPriceForSpecialOffer = async (
    vehicleId,
    userTierId
  ) => {
    const discounted: any = {};
    const subMudule = await Utils.getSubModuleId(Constants.REDIRECT_MODULE_IDS.PRE_OWNED);
    const getVehicleDownPaymentFromExlusiveOffer = await mysql.first(
      `${Tables.LOYALTY_SPECIAL_OFFERS} lso
        LEFT JOIN ${Tables.LOYALTY_SPECIAL_OFFER_DETAILS} lsod
        ON lso.${LoyaltySpecialOfferTable.ID} = lsod.${LoyaltySpecialOfferDetailTable.SPECIAL_OFFER_ID}
        AND lsod.${LoyaltySpecialOfferDetailTable.LANGUAGE_ID} = ${Constants.LANGUAGES.en.value}`,
      [
        `lsod.${LoyaltySpecialOfferDetailTable.DISCOUNT_PERCENTAGE}`,
        `lsod.${LoyaltySpecialOfferDetailTable.SPECIAL_PRICE}`,
        `lso.${LoyaltySpecialOfferTable.TIER_IDS}`,
        `lso.${LoyaltySpecialOfferTable.ITEM_ID}`,
      ],
      `lso.${LoyaltySpecialOfferTable.MODULE_ID} = ${subMudule.id}
        AND lso.${LoyaltySpecialOfferTable.ITEM_ID} = ${+vehicleId}
        AND lso.${LoyaltySpecialOfferTable.IS_ENABLE} = 1
        AND lso.${LoyaltySpecialOfferTable.IS_DELETE} = 0
        AND FIND_IN_SET(${userTierId}, lso.${LoyaltySpecialOfferTable.TIER_IDS})`
    );
    if (getVehicleDownPaymentFromExlusiveOffer) {
      const getVehicle = await mysql.first(
        `${Tables.VEHICLE} v
            LEFT JOIN ${Tables.VEHICLE_DETAIL} vd
            ON vd.${VehicleDetailTable.VEHICLE_ID} = v.${VehicleTable.ID}
            AND vd.${VehicleDetailTable.LANGUAGE_ID} = ${Constants.LANGUAGES.en.value}`,
        [
          `v.${VehicleTable.ID}`,
          `vd.${VehicleDetailTable.PRICE}`,
          `vd.${VehicleDetailTable.DEPOSITE_AMOUNT}`,
        ],
        `v.${VehicleTable.ID} = ${getVehicleDownPaymentFromExlusiveOffer.itemId}`
      );
      if (+getVehicleDownPaymentFromExlusiveOffer.discountPercentage) {
        discounted.price =
          +getVehicle.price -
          Math.round(
            (getVehicle.price * +getVehicleDownPaymentFromExlusiveOffer.discountPercentage) / 100
          );
        discounted.depositAmount =
          +getVehicle.depositAmount -
          Math.round(
            (getVehicle.depositAmount *
              +getVehicleDownPaymentFromExlusiveOffer.discountPercentage) /
              100
          );
      } else if (+getVehicleDownPaymentFromExlusiveOffer.specialPrice) {
        discounted.price = +getVehicleDownPaymentFromExlusiveOffer.specialPrice;
        discounted.depositAmount = +getVehicleDownPaymentFromExlusiveOffer.specialPrice;
      } else {
        discounted.price = +getVehicle.price;
        discounted.depositAmount = +getVehicle.depositAmount;
      }
    }
    // else {
    //   const getVehicleDownPaymentFromSpecialOffer = await mysql.first(
    //     Tables.SPECIAL_OFFERS,
    //     [
    //       SpecialOfferTable.DISCOUNT_PERCENTAGE,
    //       SpecialOfferTable.AUDIENCE_ID,
    //       SpecialOfferTable.ITEM_ID,
    //     ],
    //     `${SpecialOfferTable.MODULE_ID} = ${subMudule.id}
    //     AND ${SpecialOfferTable.ITEM_ID} = ${+vehicleId}
    //     AND ${SpecialOfferTable.IS_ENABLE} = 1
    //     AND ${SpecialOfferTable.IS_DELETE} = 0`
    //   );
    //   if (getVehicleDownPaymentFromSpecialOffer) {
    //     const getUserFromAudience = await mysql.first(
    //       `${Tables.USER_AUDIENCES} ua
    //     LEFT JOIN ${Tables.DEVICE} d ON ua.${UserAudienceTable.DEVICE_ID} = d.${DeviceTable.ID}
    //     LEFT JOIN ${Tables.USER} u ON u.${UserTable.ID} = d.${DeviceTable.USER_ID}`,
    //       ['COUNT(DISTINCT ua.id) as count'],
    //       `u.${UserTable.ID} = ${userId}
    //       AND ua.${UserAudienceTable.AUDIENCE_ID} = ${getVehicleDownPaymentFromSpecialOffer.audienceId}`
    //     );
    //     if (getUserFromAudience.count && getUserFromAudience.count > 0) {
    //       const getVehicle = await mysql.first(
    //         `${Tables.VEHICLE} v
    //           LEFT JOIN ${Tables.VEHICLE_DETAIL} vd
    //           ON vd.${VehicleDetailTable.VEHICLE_ID} = v.${VehicleTable.ID}
    //           AND vd.${VehicleDetailTable.LANGUAGE_ID} = ${Constants.LANGUAGES.en.value}`,
    //         [
    //           `v.${VehicleTable.ID}`,
    //           `vd.${VehicleDetailTable.PRICE}`,
    //           `vd.${VehicleDetailTable.DEPOSITE_AMOUNT}`,
    //         ],
    //         `v.${VehicleTable.ID} = ${getVehicleDownPaymentFromSpecialOffer.itemId}`
    //       );
    //       if (+getVehicleDownPaymentFromSpecialOffer.discountPercentage) {
    //         discounted.price = Math.round(
    //           (getVehicle.price * +getVehicleDownPaymentFromSpecialOffer.discountPercentage) / 100
    //         );
    //         discounted.depositAmount = Math.round(
    //           (getVehicle.depositAmount *
    //             +getVehicleDownPaymentFromSpecialOffer.discountPercentage) /
    //             100
    //         );
    //       }
    //     }
    //   }
    // }
    return discounted;
  };

  public static switchForVehicleSpecialOffer = async (type, vehicleId, userTierId) => {
    switch (type) {
      case Constants.REDIRECT_MODULE_IDS.NEW_VEHICLE:
        return await Utils.getVehicleDownPaymentDiscountedPriceForSpecialOffer(
          vehicleId,
          userTierId
        );
      case Constants.REDIRECT_MODULE_IDS.PRE_OWNED:
        return await Utils.getPreOwnedVehicleDownPaymentDiscountedPriceForSpecialOffer(
          vehicleId,
          userTierId
        );

      default:
        const discounted: any = {};
        return discounted;
    }
  };
}
