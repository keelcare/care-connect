import { User } from '@/types/api';

export interface NannyProfileFormState {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
  profileImageUrl: string;
  permanentAddress: string;
  sameAsCurrentAddress: boolean;
  city: string;
  educationQualification: string;
  educationQualificationOther: string;
  streamSubjects: string;
  shadowTeacherExperience: string;
  ageGroupsWorked: string[];
  childrenTypesSupported: string[];
  childrenTypesOther: string;
  academicSubjects: string[];
  hobbiesInterests: string;
  hobbiesActivitiesForChild: string[];
  previousSalary: string;
  availableStartDate: string;
  trainingAgreement: boolean | null;
  placementFeeAgreement: boolean | null;
  policeVerificationConsent: boolean | null;
  declarationConfirmed: boolean;
}

export function buildInitialFormState(user: User | null): NannyProfileFormState {
  const d = user?.nanny_onboarding_details;
  const currentAddress = user?.profiles?.address || '';
  const permanentAddress = d?.permanent_address || '';
  return {
    firstName: user?.profiles?.first_name || '',
    lastName: user?.profiles?.last_name || '',
    age: d?.age != null ? String(d.age) : '',
    gender: d?.gender || '',
    phone: user?.profiles?.phone || '',
    address: currentAddress,
    profileImageUrl: user?.profiles?.profile_image_url || '',
    permanentAddress,
    sameAsCurrentAddress: !!currentAddress && currentAddress === permanentAddress,
    city: d?.city || '',
    educationQualification: d?.education_qualification || '',
    educationQualificationOther: d?.education_qualification_other || '',
    streamSubjects: d?.stream_subjects || '',
    shadowTeacherExperience: d?.shadow_teacher_experience || '',
    ageGroupsWorked: d?.age_groups_worked || [],
    childrenTypesSupported: d?.children_types_supported || [],
    childrenTypesOther: d?.children_types_other || '',
    academicSubjects: d?.academic_subjects || [],
    hobbiesInterests: d?.hobbies_interests || '',
    hobbiesActivitiesForChild: d?.hobbies_activities_for_child || [],
    previousSalary: d?.previous_salary || '',
    availableStartDate: d?.available_start_date
      ? d.available_start_date.slice(0, 10)
      : '',
    trainingAgreement: d?.training_agreement ?? null,
    placementFeeAgreement: d?.placement_fee_agreement ?? null,
    policeVerificationConsent: d?.police_verification_consent ?? null,
    declarationConfirmed: d?.declaration_confirmed ?? false,
  };
}

export function toUpdateUserDto(form: NannyProfileFormState) {
  return {
    firstName: form.firstName,
    lastName: form.lastName,
    phone: form.phone,
    address: form.address,
    profileImageUrl: form.profileImageUrl,
  };
}

export function toUpsertOnboardingDto(form: NannyProfileFormState) {
  return {
    age: form.age ? Number(form.age) : undefined,
    gender: form.gender || undefined,
    permanentAddress: form.sameAsCurrentAddress ? form.address : form.permanentAddress,
    city: form.city || undefined,
    educationQualification: form.educationQualification || undefined,
    educationQualificationOther: form.educationQualificationOther || undefined,
    streamSubjects: form.streamSubjects || undefined,
    shadowTeacherExperience: form.shadowTeacherExperience || undefined,
    ageGroupsWorked: form.ageGroupsWorked,
    childrenTypesSupported: form.childrenTypesSupported,
    childrenTypesOther: form.childrenTypesOther || undefined,
    academicSubjects: form.academicSubjects,
    hobbiesInterests: form.hobbiesInterests || undefined,
    hobbiesActivitiesForChild: form.hobbiesActivitiesForChild,
    previousSalary: form.previousSalary || undefined,
    availableStartDate: form.availableStartDate || undefined,
    trainingAgreement: form.trainingAgreement ?? undefined,
    placementFeeAgreement: form.placementFeeAgreement ?? undefined,
    policeVerificationConsent: form.policeVerificationConsent ?? undefined,
    declarationConfirmed: form.declarationConfirmed,
  };
}
