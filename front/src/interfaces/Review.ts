import type { clasesType } from '../types/ClassType';
import type { User } from './User';

export type Review = {
   id: string;
   rating: number;
   comment?: string;
   type: 'review' | 'grade';
   author: User;
   targetStudent?: User;
   course?: clasesType;
   createdAt: Date;
   updatedAt: Date;
};
