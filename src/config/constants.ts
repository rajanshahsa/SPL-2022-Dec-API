import * as Enum from 'enum';
import { Tables } from '../config/tables';

export class Constants {
  public static readonly TIMEZONE = 'Asia/Kolkata';
  public static readonly SUCCESS = 'SUCCESS';
  public static readonly ERROR = 'ERROR';
  public static readonly BAD_DATA = 'BAD_DATA';
  public static readonly CODE = 'CODE';
  public static readonly DATA_BASE_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  public static readonly DATE_HOUR_MINUTE_FORMAT = 'YYYY-MM-DD HH:mm';
  public static readonly DATA_BASE_DATE_FORMAT = 'YYYY-MM-DD';
  public static readonly DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
  public static readonly DATE_FORMAT = 'DD/MM/YYYY';
  public static readonly TIME_HOUR_MINUTE_FORMAT = 'HH:mm';
  public static readonly TIME_HOUR_MINUTE_AM_FORMAT = 'hh:mm a';
  public static readonly DATE_DDD_MMMM_FORMAT = 'ddd, MMMM Do';
  public static readonly DATE_DAY_FORMAT = 'dddd';
  public static readonly DATE_DD_MMMM_YYYY_FORMAT = 'DD MMMM YYYY'
  public static readonly TIME_HOUR_FORMAT = 'HH';
  public static readonly TIME_MIN_FORMAT = 'mm';
  public static readonly TIME_HOUR_FORMAT_12 = 'hh:mm A';
  public static readonly DUPLICATE_CODE = 409;
  public static readonly LIMIT_EXCEED_CODE = 413;
  public static readonly INVALID_DATA_CODE = 422;
  public static readonly UNAUTHORIZED_CODE = 401;
  public static readonly NOT_FOUND_CODE = 404;
  public static readonly PRECONDITION_FAILED = 412;
  public static readonly SUCCESS_CODE = 200;
  public static readonly INTERNAL_SERVER_ERROR_CODE = 500;
  public static readonly FAIL_CODE = 400;
  public static readonly FORCE_UPDATE_CODE = 406;
  public static readonly RANDOM_CODE_STR_LENGTH = 6;
  public static readonly EXPIRY_MINUTES = 5;
  public static readonly HASH_STRING_LIMIT = 12;
  public static readonly MASTER_OTP = '123456';
  public static readonly TIME_ZONE = 240;
  public static readonly LOCALTEXT_SENDER_NAME = 'OTLNK';
  public static readonly OTP_EXPIRE_LIMIT = 2;
  public static readonly DEFAULT_LIMIT = 10;
  public static readonly DEFAULT_PAGE = 1;
  public static readonly TIME_INTERVAL = 120;
  public static readonly TIME_SLOT_INTERVAL = 30;
  public static readonly EMAIL_EXPIRE_LIMIT = 24;
  public static readonly FILE_SIZE = 15;
  public static readonly DEFAULT_COUNTRY_CODE = '961';
  public static readonly NOTIFICATION_SOUND = 'Default';
  public static readonly CONTACT_NO = 1536;
  public static readonly EMAIL_REDIRECTION_LINK = 'auth/verify-email';
  public static readonly MEDIA_THUMB_TYPE = 'GENERAL';
  public static readonly SUB_TYPE_EMAIL = 'email';
  public static readonly DEFAULT_SMS_TYPE = 'Transactional';

  public static readonly DEVICE_TYPE = {
    IOS: 'iOS',
    ANDROID: 'android',
  };

  public static readonly TEST_DRIVE_TYPE = new Enum({ dealer: 'atDealer', home: 'atHome' });
  public static readonly TEST_DRIVE_BOOKING_SOURCE = 'mobile';

  public static readonly LANGUAGES = new Enum({ en: 1, ar: 2 });

  public static readonly CONTENT_TYPE = new Enum({ about: 1, policy: 2, terms: 3 });

  public static readonly INQUIRY_TYPE = new Enum({
    'General Inquiry': 5,
    'Sales Inquiry': 6,
    'Service Inquiry': 7,
    'Billing Inquiry': 8,
  });

  public static readonly COMPLAINT_TYPE = new Enum({
    'General': 5,
    'Sales': 6,
    'Service': 7,
    'Parts': 15
  })

  public static readonly INQUIRY_TYPE_IDS = {
    GENERAL: 5,
    SALES: 6,
    SERVICE: 7,
    BILLING: 8,
  };

  public static readonly VEHICLE_TYPES = {
    PREOWNED: 'preOwned',
    NEW: 'new'
  };

  public static readonly VEHICLE_APPROVAL_STATUS = {
    APPROVED: 'approved',
    PENDING: 'pending',
    REJECTED: 'rejected',
  };

  public static readonly SES_API_VERSION = '2010-12-01';

  public static readonly MASTER_TABLES = {
    [Tables.HOBBIES]: {},
    [Tables.MODULE]: {
      isEnable: true,
      isStaff: true,
    },
    [Tables.SUBMODULE]: {},
    [Tables.DESIGNATION]: {},
    [Tables.HOLIDAYS]: {},
    [Tables.OCCUPATIONS]: {},
  };

  public static readonly MODULE_IDS = [3, 4];

  public static readonly CDK_URLS = {
    REQUEST_TOKEN: '/ServiceOnline/RequestToken',
    CHECK_PASSWORD: '/ServiceOnline/CheckPassword',
    CHASIS_PRE_POPULATION: '/ServiceOnline/ChassisPrePopulation',
    GET_MAKE_MODEL_VARIANT: '/ServiceOnline/GetMakeModelVariant',
    GET_RECOMMENDED_SERVICE: '/ServiceOnline/GetRecommendedService',
    GET_APPOINTMENT_DATES: '/ServiceOnline/GetAppointmentDates',
    GET_APPOINTMENT_TIME: '/ServiceOnline/GetAppOptionsAndTime',
    ADD_APPOINTMENT: '/ServiceOnline/AddAppointment',
    GET_SERVICE_ADVISORS: '/ServiceOnline/GetServiceAdvisors',
    UPDATE_APPOINTMENT: '/ServiceOnline/UpdateAppointment',
    CONFIRM_APPOINTMENT: '/ServiceOnline/ConfirmAppointment',
    DELETE_APPOINTMENT: '/ServiceOnline/DeleteCustomerAppointment',
    ACTIVE_TOKEN: '/ServiceOnline/ActivateToken',
    REGISTER_CUSTOMER: '/ServiceOnline/RegisterCustomer',
    ADD_CUSTOMER_VEHICLE: '/ServiceOnline/AddCustomerVehicle',
    DELETE_CUSTOMER_VEHICLE: '/ServiceOnline/DeleteCustomerVehicle',
    GET_LIST_OF_APPOINTMENTS: '/ServiceOnline/GetListOfAppointments',
    UPDATE_CUSTOMER_INFO: '/ServiceOnline/UpdateCustomerInformation',
    GET_CUSTOMER_INFO: '/ServiceOnline/GetCustomerInformation',
  };
  public static readonly ANIMATED_SPECIFICATIONS = [
    'Top Speed (KM)',
    'Horsepower',
    'Cubic Capacity',
  ];

  public static readonly PAYMENT_ORDER_TYPE = ['service', 'vehicleDeposite', 'makePayment'];

  public static readonly DEALERSHIP_TIMING_TYPES = ['homeService', 'cashCollection'];

  public static readonly PAYMENT_TYPE = ['cod', 'cardPayment'];

  public static readonly VEHICLE_DOWN_PAYMENT_TYPES = ['cod', 'prePaid'];

  public static readonly PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    PROCESSING: 'processing',
    FAILED: 'failed',
  };

  public static readonly ORDER_STATUS = {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    CANCELLED: 'cancelled',
  };

  public static readonly JOB_STATUS = {
    NEW: 'new',
  };

  public static readonly SERVICE_STATUS = {
    PENDING: 'pending',
  };

  public static readonly NOTIFICATION_TYPES = {
    PUSH: 'push',
    EMAIL: 'email',
    BOTH: 'both',
  };

  public static readonly DEALERSHIP_LOCATION_TYPES = ['showroom', 'workshop', 'partsCenter'];

  public static readonly HOME_SERVICE_TIMING = ['AM', 'PM'];

  public static readonly AREEBA_URLS = {
    CREATE_SESSION: '/session',
    RETRIVE_ORDER: '/order',
    TOKENIZATION: '/token',
    PAY_WITH_TOKEN: '/transaction',
  };

  public static readonly API_METHOD = {
    POST: 'POST',
    GET: 'GET',
  };

  public static readonly REDIRECT_MODULE_IDS = {
    PREOWNED: 'Vehicles',
    NEW: 'Vehicles',
    TESTDRIVE: 'Test drive',
    SERVICES: 'Service',
    HOMESERVICES: 'Home Service',
    SPECIALOFFERS: 'Special Offers',
    PAYMENT: 'Payment',
    INQUIRY: 'Inquiry',
    CUSTOMER: 'Customer',
    SURVEY: 'Survey',
    COMPLAINT: 'Feedback',
    NEW_VEHICLE: 'New vehicles',
    PRE_OWNED: 'Pre-owned',
    LOYALTY: 'Loyalty',
    HOLIDAYS: 'Holidays'
  };

  public static readonly MODULE_NAMES = {
    PREOWNED: 'CERTIFIED_PRE_OWNED',
    NEW: 'NEW_VEHICLES',
    TESTDRIVE: 'BOOK_TEST_DRIVE',
    SERVICES: 'BOOK_A_SERVICE',
    HOMESERVICES: 'HOME_SERVICES',
    SPECIALOFFERS: 'SPECIAL_OFFERS',
    PAYMENT: 'MAKE_A_PAYMENT',
    NOTIFICATION_TESTDRIVE: 'TEST_DRIVE',
    NOTIFICATION_PAYMENT: 'PAYMENT',
    NOTIFICATION_INQUIRY: 'INQUIRY',
    MY_VEHICLE: 'MY_VEHICLE',
    SURVEY: 'SURVEY',
    COMPLAINT: 'COMPLAINT'
  };

  public static readonly LOYALTY_TYPES = {
    HOME_SERVICE: 'homeService',
    MAKE_PAYMENT: 'makePayment',
    VEHICLE_DOWN_PAYMENT: 'vehicleDownPayment',
    VEHICLE_DOWN_PAYMENT_COD: 'vehicleDownPaymentCod'
  }

  public static readonly SURVEY_TRIGGER_POINTS = {
    SERVICE_COMPLETED: 'serviceCompleted',
    HOME_SERVICE_COMPLETED: 'homeServiceCompleted',
    TEST_DRIVE_COMPLETED: 'testDriveCompleted',
    LIVE_CHAT_COMPLETED: 'liveChatCompleted',
    FEEDBACK_CLOSED: 'feedbackClosed',
    MAKE_PAID_PAYMENT: 'makePaidPayment'
  }
}
