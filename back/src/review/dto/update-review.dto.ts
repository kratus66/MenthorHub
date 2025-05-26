import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateReviewDto)
export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
