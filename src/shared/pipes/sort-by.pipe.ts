import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class SortByPipe
  implements PipeTransform<string[], [string, 'asc' | 'desc'][]>
{
  private allowedFields: string[];
  constructor(allowedFields: string[]) {
    this.allowedFields = allowedFields;
  }
  transform(
    value: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    metadata: ArgumentMetadata,
  ): [string, 'asc' | 'desc'][] {
    if (!value) {
      return [];
    }

    if (typeof value === 'string') {
      value = [value];
    }

    if (!value.length) {
      return [];
    }

    const sortedFields = value.map((field) => {
      const trimmedField = field.startsWith('-') ? field.slice(1) : field;
      if (!this.allowedFields.includes(trimmedField)) {
        throw new HttpException(
          {
            message: 'Input data validation failed',
            errors: {
              sortBy: `Field ${trimmedField} is not allowed`,
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return [
        this.toSnakeCase(trimmedField),
        field.startsWith('-') ? 'desc' : 'asc',
      ];
    });

    return sortedFields as [string, 'asc' | 'desc'][];
  }

  private toSnakeCase(field: string): string {
    return field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
