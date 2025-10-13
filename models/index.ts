// Central export file for all models
// This makes it easier to import models throughout the app

export { default as User } from './User';
export { default as Item } from './Item';
export { default as Order } from './Order';
export { default as Transaction } from './Transaction';
export { default as Review } from './Review';
export { default as Message } from './Message';
export { default as Offer } from './Offer';
export { default as Notification } from './Notification';
export { default as Report } from './Report';

// Export types
export type { IUser, ICartItem, IAddress, IUserStats } from './User';
export type { IItem, IItemImage, IItemDimensions, IItemStats } from './Item';
export type { IOrder, IOrderAddress, IOrderItem, ITrackingInfo, IRefundInfo } from './Order';
export type { ITransaction, IStripeDetails } from './Transaction';
export type { IReview } from './Review';
export type { IMessage, IMessageAttachment } from './Message';
export type { IOffer } from './Offer';
export type { INotification, INotificationAction } from './Notification';
export type { IReport } from './Report';

