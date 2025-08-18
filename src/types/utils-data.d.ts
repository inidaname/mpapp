interface CountryData {
  name: string;
  name_local: string;
  code: string;
  area_sq_km: number;
  continent: string;
  region: string;
  capital_name: string;
  capital_latitude: number;
  capital_longitude: number;
  currency: string;
  currency_local: string;
  currency_code: string;
  currency_symbol: string;
  currency_numeric: number;
  currency_subunit_value: number;
  currency_subunit_name: string;
  languages: [
    {
      name: string;
      name_local: string;
      iso_639_1: string;
      iso_639_2: string;
      iso_639_3: string;
    },
    {
      name: string;
      name_local: string;
      iso_639_1: string;
      iso_639_2: string;
      iso_639_3: string;
    },
    {
      name: string;
      name_local: string;
      iso_639_1: string;
      iso_639_2: string;
      iso_639_3: string;
    },
  ];
  flag: string;
  timezones: string[];
  borders: string[];
  is_landlocked: boolean;
  postal_code_format: string;
  postal_code_regex: string;
  iso_3166_1_numeric: number;
  iso_3166_1_alpha2: string;
  iso_3166_1_alpha3: string;
  tld: string;
  vehicle_code: string;
  fips10: string;
  un_locode: string;
  stanag_1059: string;
  ioc: string;
  fifa: string;
  itu: string;
  uic: string;
  maritime: number;
  mmc: number;
}
