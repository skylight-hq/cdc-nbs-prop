import React from "react";
import { Trans, useTranslation } from "react-i18next";

import { COVID_RESULTS } from "../constants";

interface Props {
  result: TestResult;
  isPatientApp: boolean;
  needsHeading: boolean;
}

const setCovidResultInfo = (
  result: TestResult,
  isPatientApp: boolean,
  t: translateFn
) => {
  switch (result) {
    case COVID_RESULTS.POSITIVE:
      return (
        <>
          <p>{t("testResult.notes.positive.p1")}</p>
          <ul>
            <li>{t("testResult.notes.positive.guidelines.li0")}</li>
            <li>{t("testResult.notes.positive.guidelines.li1")}</li>
            <li>{t("testResult.notes.positive.guidelines.li2")}</li>
            <li>{t("testResult.notes.positive.guidelines.li3")}</li>
            <li>{t("testResult.notes.positive.guidelines.li4")}</li>
            <li>{t("testResult.notes.positive.guidelines.li5")}</li>
          </ul>
          {isPatientApp ? (
            <Trans
              t={t}
              parent="p"
              i18nKey="testResult.notes.positive.p2"
              components={[
                <a href="https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/symptoms.html">
                  Watch for symptoms and learn when to seek emergency medical
                  attention
                </a>,
              ]}
            />
          ) : (
            <Trans
              t={t}
              parent="p"
              i18nKey="testResult.notes.positive.p2"
              components={[
                <a
                  href={t("testResult.notes.positive.symptomsLink")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  symptoms link
                </a>,
              ]}
            />
          )}
          <ul>
            <li>{t("testResult.notes.positive.emergency.li0")}</li>
            <li>{t("testResult.notes.positive.emergency.li1")}</li>
            <li>{t("testResult.notes.positive.emergency.li2")}</li>
            <li>{t("testResult.notes.positive.emergency.li3")}</li>
            <li>{t("testResult.notes.positive.emergency.li4")}</li>
          </ul>
          <p>{t("testResult.notes.positive.p3")}</p>
          <Trans
            t={t}
            parent="p"
            i18nKey="testResult.information"
            components={[
              <a
                href={t("testResult.cdcLink")}
                target="_blank"
                rel="noopener noreferrer"
              >
                cdc.gov
              </a>,
              <a
                href={t("testResult.countyCheckToolLink")}
                target="_blank"
                rel="noopener noreferrer"
              >
                county check tool
              </a>,
            ]}
          />
        </>
      );
    case COVID_RESULTS.NEGATIVE:
      return (
        <>
          <p>{t("testResult.notes.negative.p0")}</p>
          <ul className={isPatientApp ? "" : "sr-multi-column"}>
            <li>{t("testResult.notes.negative.symptoms.li0")}</li>
            <li>{t("testResult.notes.negative.symptoms.li1")}</li>
            <li>{t("testResult.notes.negative.symptoms.li2")}</li>
            <li>{t("testResult.notes.negative.symptoms.li3")}</li>
            <li>{t("testResult.notes.negative.symptoms.li4")}</li>
            <li>{t("testResult.notes.negative.symptoms.li5")}</li>
            <li>{t("testResult.notes.negative.symptoms.li6")}</li>
            <li>{t("testResult.notes.negative.symptoms.li7")}</li>
            <li>{t("testResult.notes.negative.symptoms.li8")}</li>
            <li>{t("testResult.notes.negative.symptoms.li9")}</li>
            <li>{t("testResult.notes.negative.symptoms.li10")}</li>
          </ul>
          <Trans
            t={t}
            parent="p"
            i18nKey="testResult.notes.negative.moreInformation"
            components={[
              <a
                href={t("testResult.cdcLink")}
                target="_blank"
                rel="noopener noreferrer"
              >
                cdc.gov
              </a>,
            ]}
          />
        </>
      );
    default:
      return (
        <>
          <p>{t("testResult.notes.inconclusive.p0")}</p>
          {isPatientApp && <p>{t("testResult.notes.inconclusive.p1")}</p>}
        </>
      );
  }
};

const CovidResultGuidance = (props: Props) => {
  const result = props.result;
  const isPatientApp = props.isPatientApp;
  const needsHeading = props.needsHeading;
  const { t } = useTranslation();
  const covidGuidanceArray: any = [];

  if (needsHeading) {
    covidGuidanceArray.push(
      <p className="text-bold sr-guidance-heading">
        {t("testResult.notes.h1")}
      </p>
    );
  }
  if (result === "UNDETERMINED" || result === "UNKNOWN") {
    covidGuidanceArray.push(
      setCovidResultInfo("UNDETERMINED", isPatientApp, t)
    );
  }
  if (result !== "POSITIVE") {
    covidGuidanceArray.push(setCovidResultInfo("NEGATIVE", isPatientApp, t));
  }
  if (result === "POSITIVE") {
    covidGuidanceArray.push(setCovidResultInfo("POSITIVE", isPatientApp, t));
  }
  return covidGuidanceArray;
};
export default CovidResultGuidance;
