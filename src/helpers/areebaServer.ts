import * as request from 'request';
import { Constants } from '../config/constants';
import { Log } from './logger';
import { SendEmail } from './sendEmail';

export class AreebaServer {
  static token;
  public static createSession(orderId, amount) {
    return new Promise((resolve, reject) => {
      const requestURL = `${process.env.AREEBA_URL}${process.env.MERCHANT_ID}${Constants.AREEBA_URLS.CREATE_SESSION}`;
      const options = {
        method: 'POST',
        auth: {
          username: process.env.USERID,
          password: process.env.PASSWORD
        },
        url: requestURL,
        body: {
          "apiOperation": "CREATE_CHECKOUT_SESSION",
          "interaction": {
            "operation": "PURCHASE"
          },
          "order": {
            "currency": "LBP",
            "id": orderId,
            "amount": amount
          }
        },
        json: true,
      };

      request(options, async (error: any, response: any, body: any) => {
        if (response) {
          resolve({
            sessionId: response.body.session.id,
            isSuccess: true,
          });
        } else {
          Log.getLogger().error(`requestToken ${error}`);
          SendEmail.sendRawMail(
            null,
            null,
            [process.env.EXCEPTION_MAIL],
            `Areeba - Creaet Session Token - ERROR (${process.env.NODE_ENV})`,
            error
          );
          resolve({
            isSuccess: false,
          });
          return error;
        }
      });
    });
  }

  public static retriveOrder(orderId) {
    return new Promise((resolve, reject) => {
      const requestURL = `${process.env.AREEBA_URL}${process.env.MERCHANT_ID}${Constants.AREEBA_URLS.RETRIVE_ORDER}/${orderId}`;
      const options = {
        method: 'GET',
        auth: {
          username: process.env.USERID,
          password: process.env.PASSWORD
        },
        url: requestURL,
      };

      request(options, async (error: any, response: any, body: any) => {
        if (response) {
          const responseJSON: any = JSON.parse(response.body);
          if (responseJSON.result === 'ERROR') {
            resolve({
              result: responseJSON.result,
              isSuccess: false,
            });
          } else {
            resolve({
              '3DSecureId': responseJSON['3DSecureId'],
              result: responseJSON.result,
              isSuccess: true,
            });
          }
        } else {
          Log.getLogger().error(`retriveOrder ${error}`);
          SendEmail.sendRawMail(
            null,
            null,
            [process.env.EXCEPTION_MAIL],
            `Areeba - retrive order - ERROR (${process.env.NODE_ENV})`,
            error
          );
          resolve({
            isSuccess: false,
          });
          return error;
        }
      });
    });
  }

  public static getSaveCards(sessionId) {
    return new Promise((resolve, reject) => {
      const requestURL = `${process.env.AREEBA_URL}${process.env.MERCHANT_ID}${Constants.AREEBA_URLS.TOKENIZATION}`;
      const options = {
        method: 'POST',
        auth: {
          username: process.env.USERID,
          password: process.env.PASSWORD
        },
        url: requestURL,
        body: {
          "session": {
            "id": sessionId
          },
          "sourceOfFunds": {
            "type": "CARD"
          }
        },
        json: true,
      };

      request(options, async (error: any, response: any, body: any) => {
        if (!response.body.error) {
          resolve({
            card: response.body.sourceOfFunds.provided.card,
            token: response.body.token,
            isSuccess: true,
          });
        } else {
          Log.getLogger().error(`getSaveCards ${JSON.stringify(response.body.error)}`);
          SendEmail.sendRawMail(
            null,
            null,
            [process.env.EXCEPTION_MAIL],
            `Areeba - Get Save Cards - ERROR (${process.env.NODE_ENV})`,
            error
          );
          resolve({
            isSuccess: false,
          });
          return error;
        }
      });
    });
  }

  public static payWithToken(amount, token, secureID, orderId) {
    return new Promise((resolve, reject) => {
      const requestURL = `${process.env.AREEBA_URL}${process.env.MERCHANT_ID}${Constants.AREEBA_URLS.RETRIVE_ORDER}/${orderId}${Constants.AREEBA_URLS.PAY_WITH_TOKEN}/1`;
      const options = {
        method: 'PUT',
        auth: {
          username: process.env.USERID,
          password: process.env.PASSWORD
        },
        url: requestURL,
        body: {
          "apiOperation": "PAY",
          "order": {
            "currency": "LBP",
            "amount": amount
          },
          "sourceOfFunds": {
            "type": "CARD",
            "token": token
          },
          "3DSecureId": secureID
        },
        json: true,
      };

      request(options, async (error: any, response: any, body: any) => {
        if (!response.body.error) {
          resolve({
            result: response.body.result,
            isSuccess: true,
          });
        } else {
          Log.getLogger().error(`requestToken ${JSON.stringify(response.body.error)}`);
          SendEmail.sendRawMail(
            null,
            null,
            [process.env.EXCEPTION_MAIL],
            `Areeba - Pay with Token - ERROR (${process.env.NODE_ENV})`,
            error
          );
          resolve({
            isSuccess: false,
          });
          return error;
        }
      });
    });
  }
}
