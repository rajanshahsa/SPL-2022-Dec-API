import { Log } from './logger';
import * as AWS from 'aws-sdk';
import { Constants } from "../config/constants";


export class SendMessage {

    public static publishSnsSMS = (to, message) => {

        AWS.config.update({
            region: process.env.SnsAwsRegion,
            accessKeyId: process.env.AwsAccessKey,
            secretAccessKey: process.env.AwsSecretAccessKey,
        });

        const sns = new AWS.SNS({
            region: process.env.SnsAwsRegion
        });

        return new Promise((resolve, reject) => {
            if (process.env.NODE_ENV !== "development") {
                const params = {
                    Message: message,
                    MessageStructure: 'string',
                    PhoneNumber: to.replace('++', '+'),
                };

                const paramsAtt = {
                    attributes: {
                        DefaultSMSType: Constants.DEFAULT_SMS_TYPE,
                        DefaultSenderID: process.env.AWS_SNS_SENDER_ID,
                    },
                };

                sns.setSMSAttributes(paramsAtt, (err) => {
                    if (err) {
                        Log.getLogger().error(`Send sms ${err}`);
                    } else {
                        sns.publish(params, (snsErr, snsData) => {
                            if (snsErr) {
                                // an error occurred
                                Log.getLogger().error(`Send sms ${snsErr}`);
                                reject(snsErr);
                            } else {
                                Log.getLogger().info(`Send sms ${JSON.stringify(snsData)}`);
                                resolve(snsData);
                            }
                        });
                    }
                });
            }
            else {
                resolve(true);
            }
        });
    }
}