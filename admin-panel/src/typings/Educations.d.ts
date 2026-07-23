import { z } from 'zod'
import { educationSchema } from '../../../src/schemas/educations.schema';

export type NewEducation = z.infer<typeof educationSchema>;

export type Education = NewEducation & {
  id: string;
};