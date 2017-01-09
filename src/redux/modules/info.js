const initialState = {
  brokerAuthority: undefined,
  commonAuthority: undefined,
  contractAuthority: undefined,
  cargoInsurance: undefined,
  autoInsurance: undefined,
  generalInsurance: undefined,
  cargoInsuranceExpiration: undefined,
  autoInsuranceExpiration: undefined,
  generalInsuranceExpiration: undefined,
  safetyRating: undefined,
  cprRating: undefined
};

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        brokerAuthority: action.brokerAuthority,
        commonAuthority: action.commonAuthority,
        contractAuthority: action.contractAuthority,
        cargoInsurance: action.cargoInsurance,
        autoInsurance: action.autoInsurance,
        generalInsurance: action.generalInsurance,
        cargoInsuranceExpiration: action.cargoInsuranceExpiration,
        autoInsuranceExpiration: action.autoInsuranceExpiration,
        generalInsuranceExpiration: action.generalInsuranceExpiration,
        safetyRating: action.safetyRating,
        cprRating: action.cprRating
      };
    default:
      return state;
  }
}

export function load(stuff) {
  return {
    type: 'LOAD',
    ...stuff
  };
}
