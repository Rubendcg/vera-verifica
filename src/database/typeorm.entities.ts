import { DocumentFile } from '../modules/documents/entities/document-file.entity';
import { Document } from '../modules/documents/entities/document.entity';
import { Party } from '../modules/parties/entities/party.entity';
import { User } from '../modules/users/entities/user.entity';
import { UserVehicleAccess } from '../modules/vehicles/entities/user-vehicle-access.entity';
import { VehiclePartyRole } from '../modules/vehicles/entities/vehicle-party-role.entity';
import { Vehicle } from '../modules/vehicles/entities/vehicle.entity';
import { VerificationCenter } from '../modules/verifications/entities/verification-center.entity';
import { VerificationEvent } from '../modules/verifications/entities/verification-event.entity';
import { VerificationObligationHistory } from '../modules/verifications/entities/verification-obligation-history.entity';
import { VerificationObligation } from '../modules/verifications/entities/verification-obligation.entity';
import { VerificationScheduleRule } from '../modules/verifications/entities/verification-schedule-rule.entity';

export const typeOrmEntities = [
  Party,
  User,
  Vehicle,
  VehiclePartyRole,
  UserVehicleAccess,
  Document,
  DocumentFile,
  VerificationCenter,
  VerificationEvent,
  VerificationObligation,
  VerificationObligationHistory,
  VerificationScheduleRule,
];
