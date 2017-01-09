export function getChanges(xml) {
  if (xml['soapenv:Envelope']['soapenv:Body'][0]['soapenv:Fault']) {
    return {
      xml: xml,
      error: true
    };
  }

  const xmlResultData = xml['soapenv:Envelope']['soapenv:Body'][0]['tfm:lookupCarrierResponse'][0]['tfm:lookupCarrierResult'][0];
  if (xmlResultData['tcor:serviceError']) {
    return {
      xml: xml,
      error: true,
      detailedMessage: xmlResultData['tcor:serviceError'][0]['tcor:detailedMessage'][0]
    };
  }

  const result = {};
  const xmlSuccessData = xmlResultData['tfm:lookupCarrierSuccessData'][0];

  if (xmlSuccessData['tfm:dotAuthority']) {
    result.commonAuthority = xmlSuccessData['tfm:dotAuthority'][0]['tcor:commonAuthority'][0]._;
    result.contractAuthority = xml['soapenv:Envelope']['soapenv:Body'][0]['tfm:lookupCarrierResponse'][0]['tfm:lookupCarrierResult'][0]['tfm:lookupCarrierSuccessData'][0]['tfm:dotAuthority'][0]['tcor:contractAuthority'][0]._;
    result.brokerAuthority = xml['soapenv:Envelope']['soapenv:Body'][0]['tfm:lookupCarrierResponse'][0]['tfm:lookupCarrierResult'][0]['tfm:lookupCarrierSuccessData'][0]['tfm:dotAuthority'][0]['tcor:brokerAuthority'][0]._;
  }

  if (xmlSuccessData['tfm:dotInsurance']['tfm:insuranceCertifiates']) {
    // getInsurance
  }

  if (xmlSuccessData['tfm:safetyRating']) {
    result.safetyRating = xmlSuccessData['tfm:safetyRating'][0]['tfm:rating']._;
  }

  if (xmlSuccessData['tfm:cprRating']) {
    result.cprRating = xmlSuccessData['tfm:cprRating'][0]._;
  }

  return result;
}
