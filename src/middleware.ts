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
