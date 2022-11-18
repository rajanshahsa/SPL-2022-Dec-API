export class Tables {
  public static readonly USER = 'users';
  public static readonly STAFF = 'staff';
  public static readonly DEVICE = 'devices';
  public static readonly MODULE = 'modules';
  public static readonly HOBBIES = 'hobbies';
  public static readonly VEHICLE = 'vehicles';
  public static readonly TIMESLOT = 'timeSlots';
  public static readonly TESTDRIVE = 'testDrives';
  public static readonly ATTACHMENT = 'attachments';
  public static readonly USER_HOBBIES = 'userHobbies';
  public static readonly USER_VEHICLE = 'userVehicles';
  public static readonly USER_DOCUMENT = 'userDocuments';
  public static readonly VEHICLE_DETAIL = 'vehicleDetails';
  public static readonly CAROUSEL_SLIDERS = 'carouselSliders';
  public static readonly ATTACHMENT_THUMB = 'attachmentThumbs';
  public static readonly DEALERSHIP_LOCATION = 'dealershipLocations';
  public static readonly DEALERSHIP_LOCATION_DETAIL = 'dealershipLocationDetails';
  public static readonly VEHICLE_COLOURS = 'vehicleColors';
  public static readonly COLOURS = 'colours';
  public static readonly FEATURES = 'features';
  public static readonly FEATURES_DETAILS = 'featuresDetails';
  public static readonly FEATURES_TYPES = 'featureTypes';
  public static readonly FEATURES_TYPES_DETAILS = 'featureTypesDetails';
  public static readonly SPECIFICATION = 'specifications';
  public static readonly SPECIFICATION_DETAIL = 'specificationDetails';
  public static readonly VEHICLE_FEATURES = 'vehicleFeatures';
  public static readonly USER_VEHICLE_DOCUMENTS = 'userVehicleDocuments';
  public static readonly VEHICLE_VIEW_TRACKING = 'vehicleViewTracking';
  public static readonly USER_CHANGES_TRACKING = 'userChangesTracking';
  public static readonly VEHICLE_SPECIFICATION = 'vehicleSpecifications';
  public static readonly VEHICLE_IMAGES = 'vehicleImages';
  public static readonly MENU = 'menu';
  public static readonly MENU_DETAILS = 'menuDetails';
  public static readonly COUNTRY = 'country';
  public static readonly COUNTRY_DETAILS = 'countryDetails';
  public static readonly STATE = 'state';
  public static readonly STATE_DETAILS = 'stateDetails';
  public static readonly CITY = 'city';
  public static readonly CITY_DETAILS = 'cityDetails';
  public static readonly CART = 'cart';
  public static readonly CART_DETAILS = 'cartDetails';
  public static readonly HOME_SERVICES = 'homeServices';
  public static readonly HOME_SERVICES_DETAILS = 'homeServicesDetails';
  public static readonly HOME_SERVICE_IMAGES = 'homeServiceImages';
  public static readonly ORDERS = 'orders';
  public static readonly ORDER_DETAILS = 'orderDetails';
  public static readonly PAYMENT_ORDER = 'paymentOrders';
  public static readonly SETTINGS = 'settings';
  public static readonly CMS = 'cms';
  public static readonly CMS_DETAILS = 'cmsDetails';
  public static readonly CONTACT_US = 'contactUs';
  public static readonly COMPLAINTS = 'complaints';
  public static readonly SPECIAL_OFFERS = 'specialOffers';
  public static readonly SPECIAL_OFFER_DETAILS = 'specialOfferDetails';
  public static readonly AUDIENCES = 'audiences';
  public static readonly SPECIAL_OFFER_ENGAGEMENT = 'specialOfferEngagment';
  public static readonly SUBMODULE = 'subModules';
  public static readonly USER_CARDS = 'userCards';
  public static readonly PAYMENT_REQUESTS = 'paymentRequests';
  public static readonly PAYMENT_REQUEST_DETAILS = 'paymentRequestDetails';
  public static readonly USER_AUDIENCES = 'userAudiences';
  public static readonly DESIGNATION = 'designation';
  public static readonly SERVICE_BOOKINGS = 'serviceBookings';
  public static readonly SERVICE_BOOKING_DETAILS = 'serviceBookingDetails';
  public static readonly HOLIDAYS = 'holidays';
  public static readonly USER_NOTIFICATIONS = 'userNotifications';
  public static readonly VEHICLE_DEPOSIT_TRACKING = 'vehicleDepositTracking';
  public static readonly DEALERSHIP_LOCATION_TYPE = 'dealershipLocationTypes';
  public static readonly HOME_SERVICE_VIEW_TRACKING = 'homeServiceTracking';
  public static readonly OCCUPATIONS = 'occupation';
  public static readonly STAFF_NOTIFICATIONS = 'staffNotifications';
  public static readonly STAF_MODULE_ACCESS = 'staffModuleAccess';
  public static readonly VEHICLE_TYPE = 'vehicleType';
  public static readonly APPVERSIONS = 'AppVersions';
  public static readonly LOYALTY_DETAILS = 'loyaltyDetails';
  public static readonly TIER_DETAILS = 'tierDetails';
  public static readonly TIER_BENEFITS = 'tierBenefits';
  public static readonly LOYALTY_SPECIAL_OFFERS = 'loyaltySpecialOffers';
  public static readonly LOYALTY_SPECIAL_OFFER_DETAILS = 'loyaltySpecialOfferDetails';
  public static readonly ROADSIDE_ASSISTANCES = 'roadsideAssistances';
  public static readonly SURVEYS = 'surveys';
  public static readonly SURVEYS_DETAILS = 'surveyDetails';
  public static readonly SURVEYS_QUESTIONS = 'surveyQuestions';
  public static readonly SURVEYS_QUESTION_DETAILS = 'surveyQuestionDetails';
  public static readonly SURVEYS_QUESTION_REVIEWS = 'surveyQuestionReviews';
  public static readonly COMPLAINT_DISCUSSIONS = 'complaintDiscussions';
  public static readonly LOYALTY_SPECIAL_OFFER_ENGAGEMENT = 'loyaltySpecialOfferEngagment';
  public static readonly DEALERSHIP_LOCATION_TIMING = 'dealershipLocationTiming';
  public static readonly PLAYERS = 'players';
  public static readonly TEAMPLAYERS = 'teamPlayer';
  public static readonly TEAM = 'team';

}

// country table's fields
export enum CountryTable {
  ID = 'id',
}

// countryDetails table's fields
export enum CountryDetailTable {
  ID = 'id',
  COUNTRY_ID = 'countryId',
  LANGUAGE_ID = 'languageId',
  NAME = 'name',
}

// countryDetails table's fields
export enum UserCardsTable {
  ID = 'id',
  USER_ID = 'userId',
  SESSION_ID = 'sessionId',
  THREED_SECURE_ID = '3DSecureId',
  TOKEN = 'token',
  cardNumber = 'cardNumber',
  expiry = 'expiry',
  brand = 'brand',
}

// state table's fields
export enum StateTable {
  ID = 'id',
  COUNTRY_ID = 'countryId',
}

// stateDetails table's fields
export enum StateDetailTable {
  ID = 'id',
  STATE_ID = 'stateId',
  LANGUAGE_ID = 'languageId',
  NAME = 'name',
}

// city table's fields
export enum CityTable {
  ID = 'id',
  STATE_ID = 'stateId',
}

// stateDetails table's fields
export enum CityDetailTable {
  ID = 'id',
  CITY_ID = 'cityId',
  LANGUAGE_ID = 'languageId',
  NAME = 'name',
}

// attachments table's fields
export enum AttachmentTable {
  ID = 'id',
  NAME = 'name',
  TYPE = 'type',
}

// attachments table's fields
export enum AttachmentThumbTable {
  ID = 'id',
  ATTACHMENT_ID = 'attachmentId',
  NAME = 'name',
  TYPE = 'type',
}

// Users table's fields
export enum UserTable {
  ID = 'id',
  EMAIL = 'emailid',
  PASSWORD = 'password',
  USERTYPE = 'userType',
  TEAMID = 'teamId',
  OLD_USER_ID = 'oldUserId',
  DESIGNATION_ID = 'designationId',
  TIER_ID = 'tierId',
  TITLE = 'title',
  FIRSTNAME = 'firstname',
  LASTNAME = 'lastname',
  COUNTRY_CODE = 'countryCode',
  MOBILE_NUMBER = 'mobileNumber',
  VERIFIED = 'verified',
  BIRTH_DATE = 'birthDate',
  ADDRESS = 'address',
  COUNTRY = 'country',
  PROFILE_IMAGE_ID = 'profileImageId',
  OTP = 'otp',
  OTP_EXPIRED_AT = 'otpExpireAt',
  IS_ENABLE = 'isEnable',
  IS_DELETE = 'isDelete',
  EMAIL_OTP = 'emailOtp',
  EMAIL_OTP_EXPIRED_AT = 'emailOtpExpireAt',
  LATITUDE = 'latitude',
  LONGITUDE = 'longitude',
  IS_EMAIL_VERIFY = 'isEmailVerified',
  EMAIL_VERIFICATION_TOKEN = 'emailVerificationToken',
  CREATED_AT = 'createdAt',
  CDK_CUSTOMER_ID = 'cdkCustomerId',
  SAB_CUSTOMER_ID = 'sabCustomerId',
  LIFE_TIME_EARNED_POINTS = 'lifeTimeEarnedPoints',
  TOTAL_REDEMPTION = 'totalRedemption',
  CURRENT_POINTS = 'currentPoints',
  IS_FIRST_LOGIN = 'isFirstLogin',
  TAP_CUST_ID = 'tapCustomerId',
  LANGUAGE = 'language',
  NATIONALITY = 'nationality',
  PASSPORT_NUMBER = 'passportNumber',
  SOCIAL_ID = 'socialId',
  TIER_UPDATE_DATE = 'tierUpdateDate'
}

// Devices table's fields
export enum DeviceTable {
  ID = 'id',
  USER_ID = 'userId',
  DEVICE_TYPE = 'deviceType',
  DEVICE_TOKEN = 'deviceToken',
  FCM_TOKEN = 'fcmToken',
  TIME_ZONE = 'timeZone',
  LANGUAGE = 'language',
  BADGE = 'badge',
  CREATED_AT = 'createdAt',
  APPVERSIONS = 'appVersion',
}

// modules table's fields
export enum ModuleTable {
  ID = 'id',
  NAME = 'name',
  IS_ENABLE = 'isEnable',
  CAN_DISABLE = 'canDisable',
  IS_LOGIN_REQUIRED = 'isLoginRequired',
}

export enum SubModuleTable {
  ID = 'id',
  MODULE_ID = 'moduleId',
  NAME = 'name',
  CAN_DISABLE = 'canDisable',
  IS_FOR_CAROUSEL = 'isForCarousel',
}

// carouselSliders table's fields
export enum CarouselSliderTable {
  ID = 'id',
  MODULE_ID = 'moduleId',
  ITEM_ID = 'itemId',
  LINK = 'link',
  MODULE_NAME = 'moduleName',
  IMAGE = 'image',
  IS_ENABLE = 'isEnable',
  IS_DELETE = 'isDeleted',
  ORDER = 'order'
}

// userVehicles table's fields
export enum UserVehicleTable {
  ID = 'id',
  USER_ID = 'userId',
  VEHICLE_NAME = 'vehicleName',
  VEHICLE_MODAL = 'vehicleModal',
  CHASSIS_NUMBER = 'chassisNumber',
  MODAL_YEAR = 'modalYear',
  PLAT_NUMBER = 'plateNumber',
  VIN_NUMBER = 'vinNumber',
  VEHICLE_MAKE_CODE = 'vehicleMakeCode',
  VEHICLE_MODEL_CODE = 'vehicleModelCode',
  VEHICLE_VARAIANT_CODE = 'vehicleVariantCode',
  VEHICLE_IMAGE = 'vehicleImage',
  SOL_VEHICLE_ID = 'solVehicleId',
  DOCUMENT = 'document',
  IS_ENABLE = 'isEnable',
  CREATED_AT = 'createdAt',
  IS_DELETE = 'isDelete',
  IS_APPROVE = 'isApprove',
}

// vehicles table's fields
export enum VehicleTable {
  ID = 'id',
  NAME = 'name',
  IS_ENABLE = 'isEnable',
  IS_DELETE = 'isDelete',
  IS_SOLD = 'isSold',
  IS_DEPOSIT_ADDED = 'isDepositAdded',
  TOTAL_VISITS = 'totalVisits',
  ODO_METRE = 'odoMeter',
  IS_TEST_DRIVE = 'isTestDrive',
  NO_OF_TEST_DRIVE = 'numberOfTestDrive',
  PAYMENT_ORDER_ID = 'paymentOrderId',
  TOTAL_DEPOSIT = 'totalDeposit',
  DEPOSIT_STATUS = 'depositStatus',
  DISPKAY_ORDER = 'displayOrder',
  TYPE = 'type',
  IS_LOYALITY = 'isLoyality',
}

// vehicleDetails table's fields
export enum VehicleDetailTable {
  ID = 'id',
  VEHICLE_ID = 'vehicleId',
  LANGUAGE_ID = 'languageId',
  NAME = 'name',
  PRICE = 'price',
  DESCRIPTION = 'description',
  MODEL = 'model',
  YEAR = 'year',
  E_CATALOGUE = 'eCatalogueId',
  IMAGES = 'images',
  TYPE = 'type',
  CREATED_BY = 'createdBy',
  UPDATED_BY = 'updatedBy',
  DELETED_BY = 'deletedBy',
  ADDITIONAL_INFO = 'additionalInfo',
  VIDEO_URL = 'videoUrl',
  DEPOSITE_AMOUNT = 'depositAmount',
}

// hobbies table's fields
export enum HobbyTable {
  ID = 'id',
  NAME = 'name',
}

// userHobbies table's fields
export enum UserHobbyTable {
  ID = 'id',
  USER_ID = 'userId',
  HOBBY_ID = 'hobbyId',
  CREATED_BY = 'createdBy',
  UPDATED_BY = 'updatedBy',
}

// userDocuments table's fields
export enum UserDocumentTable {
  ID = 'id',
  USER_ID = 'userId',
  DOCUMENT = 'document',
  TYPE = 'type',
  VIEW = 'view',
  IS_ENABLE = 'isEnable',
  CREATED_BY = 'createdBy',
}

// timeSlots table's fields
export enum TimeSlotTable {
  ID = 'id',
  START_TIME = 'startTime',
  END_TIME = 'endTime',
  CAPACITY = 'capacity',
  TYPE = 'type',
  IS_ENABLE = 'isEnable',
}

// timeSlots table's fields
export enum TestDriveTable {
  ID = 'id',
  VEHICLE_ID = 'vehicleId',
  USER_ID = 'userId',
  DEALERSHIP_LOCATION_ID = 'dealershipLocationId',
  ASSOCIATED_STAFF_ID = 'associatedStaffId',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  START_TIME = 'startTime',
  END_TIME = 'endTime',
  TYPE = 'type',
  CUSTOMER_NAME = 'customerName',
  CUSTOMER_EMAIL = 'customerEmail',
  CUSTOMER_MOBILE = 'customerMobile',
  CUSTOMER_LOCATION_LAT = 'customerLocationLat',
  CUSTOMER_LOCATION_LONG = 'customerLocationLong',
  BOOKING_SOURCE = 'bookingSource',
  MILAGE_OUT = 'milageOut',
  MILAGE_IN = 'milageIn',
  FUEL_OUT = 'fuelOut',
  FUEL_IN = 'fuelIn',
  ISCANCAL = 'isCancel',
  UPDATED_AT = 'updatedAt',
  UPDATED_BY = 'updatedBy',
  IS_CANCEL = 'isCancel',
  IS_REMINDER_SET = 'isReminderSet',
}

// features table's fields
export enum FeatureTable {
  ID = 'id',
  FEATURE_TYPE_ID = 'featureTypeId',
  IMAGE = 'image',
}

// featuresDetails table's fields
export enum FeaturesDetailsTable {
  ID = 'id',
  FEATURE_ID = 'featureId',
  LANGUAGE_ID = 'languageId',
  NAME = 'name',
  ICON = 'icon',
}

// featuresTypes table's fields
export enum FeatureTypesTable {
  ID = 'id',
}

// featuresTypesDetails table's fields
export enum FeaturesTypesDetailsTable {
  ID = 'id',
  FEATURE_TYPE_ID = 'featureTypeId',
  LANGUAGE_ID = 'languageId',
  NAME = 'name',
}

// specifications table's fields
export enum SpecificationTable {
  ID = 'id',
  VEHICLE_ID = 'vehicleId',
}

// specificationDetails table's fields
export enum SpecificationDetailTable {
  ID = 'id',
  VEHICLE_ID = 'vehicleId',
  LANGUAGE_ID = 'languageId',
  SPECIFICATION_ID = 'specificationId',
  NAME = 'name',
  VALUE = 'value',
  IS_ENABLE = 'isEnable',
  IS_DELETE = 'isDelete',
}

// vehicleColors table's fields
export enum VehicleColorsTable {
  ID = 'id',
  VEHICLE_ID = 'vehicleId',
  COLOR_ID = 'colorId',
}

// colours table's fields
export enum ColoursTable {
  ID = 'id',
  NAME = 'name',
  CODE = 'code',
  IMAGE = 'image',
}

// vehicleFeatures table's fields
export enum VehicleFeaturesTable {
  ID = 'id',
  FEATURE_ID = 'featureId',
  VEHICLE_ID = 'vehicleId',
}

// userVehicleDocuments table's fields
export enum UserVehicleDocumentsTable {
  ID = 'id',
  DOCUMENT_ID = 'documentId',
  VEHICLE_ID = 'vehicleId',
  TYPE = 'type',
}

// vehicleViewTracking table's fields
export enum VehicleViewTracking {
  ID = 'id',
  USER_ID = 'userId',
  VEHICLE_ID = 'vehicleId',
  IP_ADDRESS = 'ipAddress',
}

// vehicleSpecifications table's fields
export enum VehicleSpecificationsTable {
  ID = 'id',
  SPECIFICATION_ID = 'specificationId',
  VEHICLE_ID = 'vehicleId',
  LANGUAGE_ID = 'languageId',
  VALUE = 'value',
}

// vehicleImages table's fields
export enum VehicleImagesTable {
  ID = 'id',
  SPECIFICATION_ID = 'specificationId',
  VEHICLE_ID = 'vehicleId',
  VEHICLE_COLOUR_ID = 'vehicleColorId',
  IMAGE = 'image',
  POSITION = 'position',
}

// dealershipLocations table's fields
export enum DealershipLocationTable {
  ID = 'id',
  TYPE_ID = 'typeId',
  NAME = 'name',
  LATITUDE = 'latitude',
  LONGITUDE = 'longitude',
  IS_ENABLE = 'isEnable',
  IS_DELETE = 'isDelete',
  ROOF_TOP_ID = 'rooftopId',
  WORK_SHOP_TYPE = 'workshopType',
  IS_FOR_HOME_SERVICE = 'isForHomeService',
  IS_FOR_CASH_COLLECTION = 'isForCashCollection',
}

// dealershipLocations table's fields
export enum DealershipLocationDetailTable {
  ID = 'id',
  DEALERSHIP_LOCATION_ID = 'dealershipLocationId',
  LANGUAGE_ID = 'languageId',
  NAME = 'name',
  LATITUDE = 'latitude',
  LONGITUDE = 'longitude',
  ADDRESS1 = 'address1',
  ADDRESS2 = 'address2',
  CITY = 'city',
  STATE = 'stateId',
  COUNTRY = 'countryId',
  VIRTUAL_LINK = 'virtualLink',
  MOBILE_NUMBER = 'mobileNumber',
  EMAIL = 'email',
  IS_ENABLE = 'isEnable',
  IS_DELETE = 'isDelete',
  CREATED_AT = 'createdAt',
  DELETED_BY = 'deletedBy',
}

// menu table's fields
export enum MenuTable {
  ID = 'id',
  HAS_SUB_MENU = 'hasSubMenu',
  ORDER = 'menuOrder',
  PARENT = 'parent',
  MODULE_ID = 'moduleId',
  SUB_MODULE_ID = 'subModuleId',
  URL = 'url',
  ICON = 'icon',
  IS_COMMON = 'isCommon',
  IMAGE = 'image',
  IS_FOR_MOBILE = 'isForMobile',
}

// menuDetails table's fields
export enum MenuDetailsTable {
  ID = 'id',
  MENU_ID = 'menuId',
  NAME = 'name',
  LANGUAGE_ID = 'languageId',
}

// cart table's fields
export enum CartTable {
  ID = 'id',
  USER_ID = 'userId',
}

// cart table's fields
export enum CartDetailTable {
  ID = 'id',
  CART_ID = 'cartId',
  HOME_SERVICE_ID = 'homeServiceId',
  QUANTITY = 'quantity',
  PRICE = 'price',
}

export enum HomeServiceTable {
  ID = 'id',
  IS_SCHEDULED = 'isScheduled',
  ENABLE_QUANTITY = 'enableQuantity',
  IS_LOYALITY = 'isLoyality',
  SKU = 'sku',
  ESTIMATED_HOURS = 'estimatedHour',
  ESTIMATED_MINUTES = 'estimatedMinutes',
  IS_ENABLE = 'isEnable',
  TOTAL_VIEWS = 'totalViews',
  TOTAL_BOOKED = 'totalBooked',
  TOTAL_SALES = 'totalSales',
  IS_DELETE = 'isDeleted',
  CREATED_AT = 'createdAt',
  DISPLAY_ORDER = 'displayOrder',
  DEALERSHIP_LOCATION_ID = 'dealershipLocationId',
}

export enum HomeServicesDetailsTable {
  ID = 'id',
  HOME_SERVICE_ID = 'homeServiceId',
  LANGUAGE_ID = 'languageId',
  NAME = 'name',
  PRICE = 'price',
  SPECIAL_PRICE = 'specialPrice',
  DESCRIPTION = 'description',
  CREATED_AT = 'createdAt',
}

export enum HomeServiceImagesTable {
  ID = 'id',
  HOME_SERVICE_ID = 'homeServiceId',
  ATTACHMENT_ID = 'attachmentId',
  CREATED_AT = 'createdAt',
}

// orders table's fields
export enum OrderTable {
  ID = 'id',
  STAFF_ID = 'staffId',
  DRIVER_STAFF_ID = 'driverStaffId',
  USER_ID = 'userId',
  GRAND_TOTAL = 'grandTotal',
  PURCHASE_DATE_TIME = 'purchaseDateTime',
  ORDER_STATUS = 'orderStatus',
  PAYMENT_TYPE = 'paymentType',
  PAYMENT_STATUS = 'paymentStatus',
  ADDRESS = 'address',
  LATITUDE = 'latitude',
  LONGITUDE = 'langitude',
  DELIVERED_DATE = 'deliveredDate',
  DELIVERED_TIME = 'deliveredTime',
  SCHEDULE_DATE = 'scheduleDate',
  JOB_STATUS = 'jobStatus',
  SCHEDULE_TIME_PREFERENCE = 'scheduleTimePreference',
  IS_CANCELLED = 'isCancelled',
  CANCELLED_DATE_TIME = 'cancelledDateTime',
  REASON_FOR_CANCELLATION = 'reasonForCancellation',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  PAYMENT_ORDER_ID = 'paymentOrderId',
  CLOCK_IN_TIME = 'clockInTime',
  CLAIMED_LOYALTY_POINTS = 'claimedLoyaltyPoints',
  REDEEMED_LOYALTY_POINT = 'redeemedLoyaltyPoints',
}

// orderDetails table's fields
export enum OrderDetailTable {
  ID = 'id',
  ORDER_ID = 'orderId',
  HOME_SERVICE_ID = 'homeServiceId',
  QUANTITY = 'quantity',
  PRICE = 'price',
}

// settings table fields
export enum SettingTable {
  ID = 'id',
  SETTING_NAME = 'settingName',
  TYPE = 'type',
  SUB_TYPE = 'subType',
  VALUE = 'value',
}

// cms table fields
export enum CmsTable {
  ID = 'id',
  TITLE = 'title',
}

// cmsDetails table fields
export enum CmsDetailTable {
  ID = 'id',
  CMS_ID = 'cmsId',
  LANGUAGE_ID = 'languageId',
  TITLE = 'title',
  CONTENT = 'content',
  UPDATED_AT = 'updatedAt',
}

// contactUs table fields
export enum ContactUsTable {
  ID = 'id',
  FULL_NAME = 'fullname',
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  INQUIRY_TYPE = 'inquiryType',
  INQUIRY_SUBJECT = 'inquirySubject',
  INQUIRY_DETAILS = 'inquiryDetails',
}

// contactUs table fields
export enum ComplaintsTable {
  ID = 'id',
  DEVICE_ID = 'deviceId',
  DESCRIPTION = 'description',
  ATTACHMENT = 'attachment',
  COMPLAINT_TYPE = 'complaintType',
  ATTACHMENT_TYPE = 'attachmentType',
  ATTACHMENT_ID = 'attachmentId',
  TICKET_NO = 'ticketNo',
  USER_ID = 'userId',
  FULL_NAME = 'fullName',
  PHONE_NUMBER = 'phoneNumber',
  EMAIL = 'email',
  SUBJECT = 'subject',
  DETAILS = 'details',
  CREATED_AT = 'createdAt',
  STATUS = 'status',
}

export enum ComplaintDiscussionsTable {
  ID = 'id',
  COMPLAINT_ID = 'complaintId',
  STAFF_ID = 'staffid',
  DEVICE_ID = 'deviceId',
  MESSAGE = 'message',
  ATTACHMENT_ID = 'attachmentId',
  CREATED_AT = 'createdAt',
}

// specialOffers table fields
export enum SpecialOfferTable {
  ID = 'id',
  AUDIENCE_ID = 'audienceId',
  DISCOUNT_PERCENTAGE = 'discountPercentage',
  MODULE_ID = 'moduleId',
  ITEM_ID = 'itemId',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  IMAGE = 'image',
  BROADCAST_METHOD = 'broadcastMethod',
  TOTAL_ENGAGEMENT = 'totalEngagement',
  IS_ENABLE = 'isEnable',
  MODULE_NAME = 'moduleName',
  IS_DELETE = 'isDeleted',
}

// specialOfferDetails table fields
export enum SpecialOfferDetailTable {
  ID = 'id',
  SPECIAL_OFFER_ID = 'specialOfferId',
  LANGUAGE_ID = 'languageId',
  TITLE = 'title',
  OFFERS_DETAIL = 'offersDetails',
  MESSAGE = 'message',
}

// audiences table fields
export enum AudienceTable {
  ID = 'id',
  NAME = 'name',
  IS_DELETE = 'isDelete',
}

// specialOfferEngagment table fields
export enum SpecialOfferEngagmentTable {
  ID = 'id',
  USER_ID = 'userId',
  SPECIAL_OFFER_ID = 'specialOfferId',
  IP_ADDRESS = 'ipAddress',
  IS_GUEST = 'IsGuest',
  ENGAGMENT_DATE = 'engagmentDate',
}

export enum LoyaltySpecialOfferEngagmentTable {
  ID = 'id',
  USER_ID = 'userId',
  SPECIAL_OFFER_ID = 'loyaltySpecialOfferId',
  IP_ADDRESS = 'ipAddress',
  IS_GUEST = 'IsGuest',
  ENGAGMENT_DATE = 'engagmentDate',
}

// paymentRequests table fields
export enum PaymentRequestTable {
  ID = 'id',
  USER_ID = 'userId',
  SCHEDULE_DATE = 'scheduleDate',
  PAYMENT_DATE_TIME = 'paymentDateTime',
  SCHEDULE_TIME_PREFERENCE = 'scheduleTimePreference',
  PAYMENT_TRANSACTION_ID = 'paymentTransactionId',
  INVOICE_ATTACHMENT_ID = 'invoiceAttachmentId',
  PAYMENT_STATUS = 'paymentStatus',
  IS_DELETED = 'isDeleted',
  PAYMENT_TYPE = 'paymentType',
  LATITUDE = 'latitude',
  LONGITUDE = 'longitude',
  ADDRESS = 'address',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  PAYMENT_ORDER_ID = 'paymentOrderId',
  IS_LOYALITY = 'isLoyality',
  REDEEMED_LOYALTY_POINT = 'redeemedLoyaltyPoints',
}

// paymentRequestDetails table fields
export enum PaymentRequestDetalTable {
  ID = 'id',
  PAYMENT_REQUEST_ID = 'paymentRequestId',
  LANGUAGE_ID = 'languageId',
  TITLE = 'title',
  DESCRIPTION = 'description',
  AMOUNT = 'amount',
}
export enum PaymentOrderDetailTable {
  ID = 'id',
  AMOUNT = 'amount',
  TYPE = 'type',
}

// userAudiences table fields
export enum UserAudienceTable {
  ID = 'id',
  AUDIENCE_ID = 'audienceId',
  DEVICE_ID = 'deviceId',
}

// paymentOrders table fields
export enum PaymentOrderTable {
  ID = 'id',
  AMOUNT = 'amount',
  TYPE = 'type',
}

// designation table's fields
export enum DesignationTable {
  ID = 'id',
  NAME = 'name',
}

export enum ServiceBookingTable {
  ID = 'id',
  DEALERSHIP_LOCATION_ID = 'dealershipLocationId',
  APPOINTMENT_ID = 'appointmentId',
  USER_ID = 'userId',
  BOOKING_DATE = 'bookingDate',
  USER_VEHICLE_ID = 'userVehicleId',
  BOOKING_TIME = 'bookingTime',
  IS_REMINDER_SET = 'isReminderSet',
  STATUS = 'status',
  IS_DELETE = 'isDeleted',
}
// holidays table fields
export enum HolidayTable {
  ID = 'id',
  DATE = 'date',
  REASON = 'reason',
  CREATED_AT = 'createdAt',
}

// userNotifications table fields
export enum UserNotificationTable {
  ID = 'id',
  RECEIVER_ID = 'receiverId',
  DEVICE_ID = 'deviceId',
  USER_ID = 'userId',
  TYPE = 'type',
  IS_READ = 'isRead',
  IS_DELETE = 'isDelete',
  CREATED_AT = 'createdAt',
  MODULE_ID = 'moduleId',
  MODULE_NAME = 'moduleName',
  ITEM_ID = 'ItemId',
  SUBJECT = 'subject',
  BODY = 'body',
  VEHICLE_ID = 'vehicleId'
}

// vehicleDepositeTracking table fields
export enum VehicleDepositeTrackingTable {
  ID = 'id',
  VEHICLE_ID = 'vehicleId',
  USER_ID = 'userId',
  AMOUNT = 'amount',
  PAYMENT_TYPE = 'paymentType',
  PAYMENT_STATUS = 'paymentStatus',
  PAYMENT_TRANSACTION_ID = 'paymentTransactionId',
  PAYMENT_ORDER_ID = 'paymentOrderId',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

// dealershipLocationTypes table's fields
export enum DealershipLocationTypeTable {
  ID = 'id',
  NAME = 'name',
}

// occupation table's fields
export enum OccupationTable {
  ID = 'id',
  NAME = 'name',
}

// staffModuleAccess table's fields
export enum StaffModuleAccessTable {
  ID = 'id',
  STAFF_ID = 'staffId',
  MODULE_ID = 'moduleId',
}

export enum VehicleTypeTable {
  ID = 'id',
  MODEL_CODE = 'modelCode',
  VEHICLE_TYPE = 'vehicleType',
}

export enum AppVersionsTable {
  ID = 'id',
  VERSION = 'version',
  ISMANDATORY = 'isMandatory',
  CREATED_AT = ' created_at',
  UPDATED_AT = 'Updated_at',
  DEVICE_TYPE = 'deviceType',
  MIN_FORCE_UPDATE = 'minForceVersion',
}
// Staff table's fields
export enum StaffTable {
  ID = 'id',
  FIRSTNAME = 'firstname',
  LASTNAME = 'lastname',
  MOBILE_NUMBER = 'mobileNumber',
  EMAIL = 'email',
  PASSWORD = 'password',
  DESIGNATION_ID = 'designationId',
  DEALERSHIP_LOCATION_ID = 'dealershipLocationId',
  IS_ENABLE = 'isEnable',
  IS_DELETE = 'isDelete',
  RESET_TOKEN = 'resetToken',
  TOKEN_EXPIRE_TIME = 'tokenExpireTime',
  ADDRESS1 = 'address1',
  ADDRESS2 = 'address2',
  CITY = 'city',
  COUNTRY = 'country',
  PROFILE_IMAGE_ID = 'profileImageId',
}

export enum LoyaltyDetailsTable {
  ID = 'id',
  USER_ID = 'userId',
  MODULE_ID = 'moduleId',
  STAFF_ID = 'staffId',
  ADDED_POINT = 'addedPoint',
  REDEEMED_POINT = 'redeemedPoint',
  NOTE = 'serviceName',
  IS_DELETED = 'isDeleted',
  CREATED_AT = 'createdAt',
}

export enum TierDetailsTable {
  ID = 'id',
  LEVEL_NAME = 'levelName',
  MIN_POINTS_EARNED = 'minPointsEarned',
  PERCENTAGE = 'percentage',
  IMAGE = 'image',
  DESCRIPTION = 'levelDescription',
  IS_ENABLE = 'isEnable',
  CREATED_AT = 'createdAt',
}

export enum TierBenefitsTable {
  ID = 'id',
  TIER_ID = 'tierId',
  TITLE = 'title',
  IS_ENABLE = 'isEnable',
  IS_DELETE = 'isDelete',
  CREATED_AT = 'createdAt',
}

export enum LoyaltySpecialOfferTable {
  ID = 'id',
  TIER_IDS = 'tierIds',
  MODULE_ID = 'moduleId',
  ITEM_ID = 'itemId',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  OFFER_TYPE = 'offerType',
  OFFER_URL = 'offerUrl',
  IMAGE = 'image',
  BROADCAST_METHOD = 'broadcastMethod',
  TOTAL_ENGAGEMENT = 'totalEngagment',
  IS_ENABLE = 'isEnable',
  MODULE_NAME = 'moduleName',
  IS_DELETE = 'isDeleted',
}

// specialOfferDetails table fields
export enum LoyaltySpecialOfferDetailTable {
  ID = 'id',
  SPECIAL_OFFER_ID = 'specialOfferId',
  LANGUAGE_ID = 'languageId',
  TITLE = 'title',
  OFFERS_DETAIL = 'offersDetails',
  MESSAGE = 'message',
  DISCOUNT_PERCENTAGE = 'discountPercentage',
  SPECIAL_PRICE = 'specialPrice',
}
export enum SurveyTable {
  ID = 'id',
  MODULEID = 'moduleId',
  AUDIENCE_ID = 'audienceId',
  IS_DELETED = 'isDeleted',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  SURVEY_TYPE = 'surveyType',
  SURVEY_URL = 'surveyUrl',
  TRIGGER_POINT = 'triggerPoint',
}

export enum SurveyDetailsTable {
  ID = 'id',
  SURVEY_ID = 'surveyId',
  LANGUAGE_ID = 'languageId',
  TITLE = 'title',
}

export enum SurveyQuestionsTable {
  ID = 'id',
  SURVEY_ID = 'surveyId',
  TYPE = 'type',
  IS_DELETED = 'isDeleted',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SurveyQuestionsDetailsTable {
  ID = 'id',
  QUESTION_ID = 'questionId',
  LANGUAGE_ID = 'languageId',
  TITLE = 'title',
}

export enum SurveyQuestionReviewsTable {
  ID = 'id',
  USER_ID = 'userId',
  SURVEY_ID = 'surveyId',
  QUESTION_ID = 'questionId',
  ANSWER = 'answer',
  FEEDBACK = 'feedback',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum DealershipLocationTimingTable {
  ID = 'id',
  DEALERSHIP_LOCATION_ID = 'dealershipLocationId',
  MODULE_ID = 'moduleId',
  DAY = 'day',
  FIRST_HALF_START_TIME = 'firstHalfStartTime',
  FIRST_HALF_END_TIME = 'firstHalfEndTime',
  SECOND_HALF_START_TIME = 'secondHalfStartTime',
  SECOND_HALF_END_TIME = 'secondHalfEndTime',
  IS_ENABLE = 'isEnable',
}

export enum PlayersTable {
  ID = "id",
  NAME = "name",
  BASEPRICE = "basePrice",
  CURRENTPRICE = "currentPrice",
  BATTINGSTYLE = "battingStyle",
  BOWLINGSTYLE = "bowlingStyle",
  ISSOLD = "isSold",
  WANTTOBECAPTAIN = "wantToBeCaptain",
  SKILLS = "skills",
  BATTINGRATING = "battingRating",
  BOWLINGRATING = "bowlingRating",
  SOLDTO = "soldTo",
  SPORTS = "sports",
}

export enum TEAMPLAYERSTable {
  ID = "id",
  PLAYERID = "playerid",
  TEAMID = "teamId"
}

export enum TEAMTable {
  ID = "id",
  NAME = "name",
  TEAMID = "teamOwnerId"
}
