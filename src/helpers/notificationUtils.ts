import * as dotenv from 'dotenv';
import * as FCM from 'fcm-node';
import { Constants } from '../config/constants';
import { Log } from './logger';
import * as mysql from 'jm-ez-mysql';
import { Tables, DeviceTable, UserNotificationTable } from '../config/tables';
import { SendEmail } from './sendEmail';
dotenv.config();

export class NotificationUtil {
  public static sendNotification = async (
    token: any,
    result: Json,
    payload: Json,
    deviceType: string
  ) => {
    const serverKey = process.env.NOTIFICATION_KEY; // put your server key here
    const fcm = new FCM(serverKey);
    const deviceTypes = [Constants.DEVICE_TYPE.ANDROID, Constants.DEVICE_TYPE.IOS];
    const message: any = {
      to: token,
      collapse_key: '',
      notification: result.notification,
      data: payload,
    };
    if (result && result.sound) {
      message.notification.sound = result.sound;
    }
    if (deviceTypes.includes(deviceType)) {
      const { title, body, badge, sound } = message.notification;
      message.data.title = title;
      message.data.body = body;
      message.data.badge = badge;
      message.data.sound = sound;
    }
    fcm.send(message, (err: any, response: any) => {
      if (err) {
        NotificationUtil.logger.info(`Notification Err: ${err}`);
      } else {
        NotificationUtil.logger.info(`Notification Sent: ${response}`);
      }
    });
  };
  private static logger: any = Log.getLogger();

  // Get User devices
  public static getDevices = async (id: number) => {
    return await mysql.findAll(
      Tables.DEVICE,
      [
        DeviceTable.ID,
        DeviceTable.DEVICE_TOKEN,
        DeviceTable.FCM_TOKEN,
        DeviceTable.USER_ID,
        DeviceTable.BADGE,
        DeviceTable.DEVICE_TYPE,
        DeviceTable.USER_ID,
      ],
      `${DeviceTable.FCM_TOKEN} IS NOT NULL AND ${DeviceTable.USER_ID} = ?`,
      [id]
    );
  };

  // proceed push notifications
  public static processPushNotification = async (
    id: number,
    notificationText: string,
    title: string,
    payload: Json
  ) => {
    const devices = await NotificationUtil.getDevices(id);
    // const tokens = devices.map((device: Json) => device.deviceToken);
    const iOSDevices = devices.filter(
      (device: Json) => device.deviceType === Constants.DEVICE_TYPE.IOS
    );
    const androidDevices = devices.filter(
      (device: Json) => device.deviceType === Constants.DEVICE_TYPE.ANDROID
    );
    const notificationData: any = {
      to: '',
      content_available: true,
      notification: {
        title,
        body: notificationText,
      },
      data: payload,
      sound: Constants.NOTIFICATION_SOUND,
      badge: 0,
    };
    const savedUserId: any = {};
    if (iOSDevices.length > 0) {
      const IOSDeviceLength = iOSDevices.length;
      for (let i = 0; i < IOSDeviceLength; i++) {
        const detail: any = {
          subject: title,
          moduleId: payload.moduleId,
          moduleName: payload.moduleName,
          itemId: payload.itemId,
          type: Constants.NOTIFICATION_TYPES.PUSH,
          body: notificationText,
          deviceId: iOSDevices[i].id,
          userId: iOSDevices[i].userId,
        };
        if (payload.vehicleId) {
          detail.vehicleId = payload.vehicleId // Sending vehicle id in Itemid only for service booking as mobile side we have common structure.
          payload.itemId = payload.vehicleId // Sending vehicle id in Itemid only for service booking as mobile side we have common structure.
        }
        let notification = { insertId: 0 };
        if (!(detail.userId in savedUserId)) {
          notification = await NotificationUtil.userNotificationEntry(detail);
          savedUserId[detail.userId] = notification.insertId;
        } else {
          notification.insertId = savedUserId[detail.userId];
        }
        let badge = { count: 0 };
        if (!iOSDevices[i].userId) {
          badge = await mysql.first(
            Tables.USER_NOTIFICATIONS,
            ['COUNT(DISTINCT id) as count'],
            `${UserNotificationTable.IS_READ} = 0
              AND ${UserNotificationTable.TYPE} = '${Constants.NOTIFICATION_TYPES.PUSH}'
              AND ${UserNotificationTable.DEVICE_ID} = ?`,
            [iOSDevices[i].id]
          );
        } else {
          badge = await mysql.first(
            Tables.USER_NOTIFICATIONS,
            ['COUNT(DISTINCT id) as count'],
            `${UserNotificationTable.IS_READ} = 0
              AND ${UserNotificationTable.TYPE} = '${Constants.NOTIFICATION_TYPES.PUSH}'
              AND ${UserNotificationTable.USER_ID} = ?`,
            [iOSDevices[i].userId]
          );
        }
        notificationData.notification.badge = badge.count;
        const iOSToken: any = iOSDevices[i].fcmToken;
        payload.notificationId = notification.insertId;
        NotificationUtil.sendNotification(
          iOSToken,
          notificationData,
          payload,
          Constants.DEVICE_TYPE.IOS
        );
      }
    }
    if (androidDevices.length > 0) {
      const androidDeviceLength = androidDevices.length;
      for (let i = 0; i < androidDeviceLength; i++) {
        const detail: any = {
          subject: title,
          moduleId: payload.moduleId,
          moduleName: payload.moduleName,
          itemId: payload.itemId,
          type: Constants.NOTIFICATION_TYPES.PUSH,
          body: notificationText,
          deviceId: androidDevices[i].id,
          userId: androidDevices[i].userId,
        };
        if (payload.vehicleId) {
          detail.vehicleId = payload.vehicleId // Sending vehicle id in Itemid only for service booking as mobile side we have common structure.
          payload.itemId = payload.vehicleId // Sending vehicle id in Itemid only for service booking as mobile side we have common structure.
        }
        let notification = { insertId: 0 };
        if (!(detail.userId in savedUserId)) {
          notification = await NotificationUtil.userNotificationEntry(detail);
          savedUserId[detail.userId] = notification.insertId;
        } else {
          notification.insertId = savedUserId[detail.userId];
        }
        let badge = { count: 0 };
        if (!androidDevices[i].userId) {
          badge = await mysql.first(
            Tables.USER_NOTIFICATIONS,
            ['COUNT(DISTINCT id) as count'],
            `${UserNotificationTable.IS_READ} = 0
              AND ${UserNotificationTable.TYPE} = '${Constants.NOTIFICATION_TYPES.PUSH}'
              AND ${UserNotificationTable.DEVICE_ID} = ?`,
            [androidDevices[i].id]
          );
        } else {
          badge = await mysql.first(
            Tables.USER_NOTIFICATIONS,
            ['COUNT(DISTINCT id) as count'],
            `${UserNotificationTable.IS_READ} = 0
              AND ${UserNotificationTable.TYPE} = '${Constants.NOTIFICATION_TYPES.PUSH}'
              AND ${UserNotificationTable.USER_ID} = ?`,
            [androidDevices[i].userId]
          );
        }
        notificationData.notification.badge = badge.count;
        const androidToken: any = androidDevices[i].fcmToken;
        payload.notificationId = notification.insertId;
        NotificationUtil.sendNotification(
          androidToken,
          notificationData,
          payload,
          Constants.DEVICE_TYPE.ANDROID
        );
      }
    }
  };

  // proceed email notifications
  public static processEmailNotification = async (id: number, emailText: string, title: string) => {
    const userEmail = await mysql.first(Tables.USER, 'email', 'id = ?', [id]);
    const data = {
      '{TITLE}': title,
      '{TEXT}': emailText,
    };
    SendEmail.sendRawMail('notification', data, [userEmail.email.toString()], title); // sending email
    return;
  };

  // proceed email notifications
  public static processEmailNotificationStaff = async (
    id: number,
    emailText: string,
    title: string
  ) => {
    const userEmail = await mysql.first(Tables.STAFF, 'email', 'id = ?', [id]);
    const data = {
      '{TITLE}': title,
      '{TEXT}': emailText,
    };
    SendEmail.sendRawMail('notification', data, [userEmail.email.toString()], title); // sending email
    return;
  };

  // Create notification entry
  public static staffNotificationEntry = async (detail: any) => {
    return await mysql.insert(Tables.STAFF_NOTIFICATIONS, detail);
  };

  // Create notification entry
  public static userNotificationEntry = async (detail: any) => {
    return await mysql.insert(Tables.USER_NOTIFICATIONS, detail);
  };
}
