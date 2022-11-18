import { Request, Response } from 'express';
import * as mysql from 'jm-ez-mysql';
import { isEmpty } from 'lodash';

import { Constants } from './config/constants';
import {
  Tables,
  UserTable,
  DeviceTable,
  AppVersionsTable,
  TierDetailsTable,
} from './config/tables';
import { Jwt } from './helpers/jwt';
import * as compareVersions from 'compare-versions';

export class Middleware {
  public loadSocketUser = async (req: any, token: string, next) => {
    const tokenInfo = Jwt.decodeAuthToken(token);
    if (tokenInfo) {
      const user = await mysql.first(
        Tables.USER,
        [UserTable.ID, UserTable.EMAIL, UserTable.VERIFIED],
        `${UserTable.ID} = ? AND ${UserTable.IS_ENABLE} = 1`,
        [tokenInfo.userId]
      );
      if (user) {
        if (user.verified) {
          const data = {
            user,
          };
          next({ error: false, data });
        } else {
          next({
            error: true,
            message: req.t('ERR_TOKEN_EXP'),
          });
        }
      } else {
        next({
          error: true,
          message: req.t('ERR_TOKEN_EXP'),
        });
      }
    } else {
      next({
        error: true,
        message: req.t('ERR_TOKEN_EXP'),
      });
    }
  };

  public getUserGuestAuthorized = async (req: any, res: Response, next: () => void) => {
    if (req.headers.authorization && !isEmpty(req.headers.authorization)) {
      try {
        const tokenInfo = Jwt.decodeAuthToken(req.headers.authorization.toString());
        if (tokenInfo) {
          const user = await mysql.first(
            `${Tables.USER} u
            LEFT JOIN ${Tables.DEVICE} d ON u.${UserTable.ID} = d.${DeviceTable.USER_ID}
            LEFT JOIN ${Tables.TIER_DETAILS} td ON td.${TierDetailsTable.ID} = u.${UserTable.TIER_ID}`,
            [
              `u.${UserTable.ID}`,
              `u.${UserTable.TITLE}`,
              `u.${UserTable.FIRSTNAME}`,
              `u.${UserTable.LASTNAME}`,
              `u.${UserTable.EMAIL}`,
              `u.${UserTable.MOBILE_NUMBER}`,
              `u.${UserTable.VERIFIED}`,
              `u.${UserTable.IS_EMAIL_VERIFY}`,
              `u.${UserTable.CDK_CUSTOMER_ID}`,
              `d.${DeviceTable.ID} as deviceId`,
              `d.${DeviceTable.TIME_ZONE}`,
              `d.${DeviceTable.LANGUAGE}`,
              `td.${TierDetailsTable.ID} as tierId`,
              `td.${TierDetailsTable.PERCENTAGE} as tierPercentage`,
              `td.${TierDetailsTable.MIN_POINTS_EARNED} as tierMinPointEarned`,
            ],
            `u.${UserTable.ID} = ${tokenInfo.userId}
              AND d.${DeviceTable.ID} = ${tokenInfo.deviceId}
              AND u.${UserTable.IS_ENABLE} = 1
              AND u.${UserTable.IS_DELETE} = 0`
          );

          if (user) {
            if (user.verified) {
              req._user = user;
              next();
            } else {
              res
                .status(Constants.PRECONDITION_FAILED)
                .json({ error: req.t('USER_NOT_VERIFIED'), code: Constants.PRECONDITION_FAILED });
              return;
            }
          } else {
            res
              .status(Constants.UNAUTHORIZED_CODE)
              .json({ error: req.t('ERR_UNAUTH'), code: Constants.UNAUTHORIZED_CODE });
            return;
          }
        } else {
          res
            .status(Constants.UNAUTHORIZED_CODE)
            .json({ error: req.t('ERR_UNAUTH'), code: Constants.UNAUTHORIZED_CODE });
          return;
        }
      } catch (error) {
        res.status(Constants.INTERNAL_SERVER_ERROR_CODE).json({
          error: req.t('ERR_INTERNAL_SERVER'),
          code: Constants.INTERNAL_SERVER_ERROR_CODE,
        });
        return;
      }
    } else {
      next();
    }
  };

  public getUserAuthorized = async (req: any, res: Response, next: () => void) => {
    if (req.headers.authorization && !isEmpty(req.headers.authorization)) {
      try {
        const tokenInfo = Jwt.decodeAuthToken(req.headers.authorization.toString());
        if (tokenInfo) {
          const user = await mysql.first(
            `${Tables.USER} u
            LEFT JOIN ${Tables.DEVICE} d ON u.${UserTable.ID} = d.${DeviceTable.USER_ID}
            LEFT JOIN ${Tables.TIER_DETAILS} td ON td.${TierDetailsTable.ID} = u.${UserTable.TIER_ID}`,
            [
              `u.${UserTable.ID}`,
              `u.${UserTable.TITLE}`,
              `u.${UserTable.FIRSTNAME}`,
              `u.${UserTable.LASTNAME}`,
              `u.${UserTable.EMAIL}`,
              `u.${UserTable.MOBILE_NUMBER}`,
              `u.${UserTable.VERIFIED}`,
              `u.${UserTable.IS_EMAIL_VERIFY}`,
              `u.${UserTable.CDK_CUSTOMER_ID}`,
              `d.${DeviceTable.ID} as deviceId`,
              `d.${DeviceTable.TIME_ZONE}`,
              `d.${DeviceTable.LANGUAGE}`,
              `td.${TierDetailsTable.ID} as tierId`,
              `td.${TierDetailsTable.PERCENTAGE} as tierPercentage`,
              `td.${TierDetailsTable.MIN_POINTS_EARNED} as tierMinPointEarned`,
            ],
            `u.${UserTable.ID} = ${tokenInfo.userId}
              AND d.${DeviceTable.ID} = ${tokenInfo.deviceId}
              AND u.${UserTable.IS_ENABLE} = 1
              AND u.${UserTable.IS_DELETE} = 0`
          );

          if (user) {
            const byPassRoutesForVerifiedCheck = [
              '/verify-otp',
              '/request-otp',
              '/verify-updated-email-otp',
              '/verify-updated-mobile-otp',
              '/update-mobile',
            ];
            if (user.verified || byPassRoutesForVerifiedCheck.includes(req.route.path)) {
              req._user = user;
              next();
            } else {
              res
                .status(Constants.PRECONDITION_FAILED)
                .json({ error: req.t('USER_NOT_VERIFIED'), code: Constants.PRECONDITION_FAILED });
              return;
            }
          } else {
            res
              .status(Constants.UNAUTHORIZED_CODE)
              .json({ error: req.t('ERR_UNAUTH'), code: Constants.UNAUTHORIZED_CODE });
            return;
          }
        } else {
          res
            .status(Constants.UNAUTHORIZED_CODE)
            .json({ error: req.t('ERR_UNAUTH'), code: Constants.UNAUTHORIZED_CODE });
          return;
        }
      } catch (error) {
        res.status(Constants.INTERNAL_SERVER_ERROR_CODE).json({
          error: req.t('ERR_INTERNAL_SERVER'),
          code: Constants.INTERNAL_SERVER_ERROR_CODE,
        });
        return;
      }
    } else {
      res
        .status(Constants.UNAUTHORIZED_CODE)
        .json({ error: req.t('ERR_UNAUTH'), code: Constants.UNAUTHORIZED_CODE });
      return;
    }
  };

  public checkDeviceVersion = async (req: any, res: Response, next: () => void) => {
    const { deviceId, bypass } = req.query;
    const currentVersion = await mysql.first(
      `${Tables.DEVICE}`,
      [`${DeviceTable.APPVERSIONS}`, `${DeviceTable.DEVICE_TYPE}`],
      `${DeviceTable.ID} = ${deviceId}`
    );
    if (currentVersion && !currentVersion.appVersion) {
      return next();
    }
    const latestVersion = await mysql.first(
      `${Tables.APPVERSIONS}`,
      [
        `${AppVersionsTable.VERSION}`,
        `${AppVersionsTable.ISMANDATORY}`,
        `${AppVersionsTable.DEVICE_TYPE}`,
        `${AppVersionsTable.MIN_FORCE_UPDATE}`,
      ],
      `${AppVersionsTable.DEVICE_TYPE}= '${(currentVersion && currentVersion.deviceType) || ''}'`
    );
    if ((bypass && bypass === 'true') || bypass === '1') {
      return next();
    }
    if (latestVersion) {
      const currentHigher = compareVersions(currentVersion.appVersion, latestVersion.version);
      if (currentHigher === 1 || currentHigher === 0) {
        return next();
      }
      if (compareVersions(latestVersion.version, currentVersion.appVersion)) {
        if (latestVersion.isMandatory) {
          return res
            .status(Constants.FORCE_UPDATE_CODE)
            .json({
              message: req.t('ERR_FORCE_UPDATE_APP'),
              isMandatory: latestVersion.isMandatory,
            });
        }
        const isForce = compareVersions(latestVersion.minForceVersion, currentVersion.appVersion);
        if (!latestVersion.isMandatory && isForce === 1) {
          return res
            .status(Constants.FORCE_UPDATE_CODE)
            .json({ message: req.t('ERR_FORCE_UPDATE_APP'), isMandatory: 1 });
        } else if (!latestVersion.isMandatory && isForce === 0) {
          return res
            .status(Constants.FORCE_UPDATE_CODE)
            .json({
              message: req.t('ERR_OPTIONAL_FORCE_UPDATE_APP'),
              isMandatory: latestVersion.isMandatory,
            });
        } else {
          return res
            .status(Constants.FORCE_UPDATE_CODE)
            .json({
              message: req.t('ERR_OPTIONAL_FORCE_UPDATE_APP'),
              isMandatory: latestVersion.isMandatory,
            });
        }
      } else {
        return next();
      }
    } else {
      return next();
    }
  };

  public deviceIdValidator = async (req: any, res: Response, next: () => void) => {
    if (req._user) {
      next();
    } else if (req.query.deviceId) {
      const language = mysql.first(
        Tables.DEVICE,
        [`${DeviceTable.LANGUAGE}`],
        `${DeviceTable.ID}= '${req.query.deviceId}'`
      );
      req.language =
        language && language.language ? language.language : Constants.LANGUAGES.en.value;
    } else {
      res.status(Constants.NOT_FOUND_CODE).json({ message: req.t('DEVICE_ID_REQUIRED_FIELD') });
    }
  };
}
