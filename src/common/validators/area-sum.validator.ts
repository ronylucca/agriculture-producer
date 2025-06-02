import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class AreaSumConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const totalArea = parseFloat(object.totalArea);
    const arableArea = parseFloat(object.arableArea);
    const vegetationArea = parseFloat(object.vegetationArea);

    if (!totalArea || !arableArea || !vegetationArea) {
      return true; // Deixa outras validações lidarem com campos obrigatórios
    }

    return (arableArea + vegetationArea) <= totalArea;
  }

  defaultMessage(args: ValidationArguments) {
    return 'A soma da área agricultável e área de vegetação não pode ser maior que a área total';
  }
}

export function IsValidAreaSum(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AreaSumConstraint,
    });
  };
} 