import specialtiesData from '../../data/specialties.json';

export type Specialty = {
  id: string;
  name: string;
};

export const specialties: Specialty[] = specialtiesData.map((specialty) => ({
  id: specialty.value,
  name: specialty.label,
}));
