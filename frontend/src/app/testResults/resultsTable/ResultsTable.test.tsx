import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PATIENT_TERM_CAP } from "../../../config/constants";
import TEST_RESULTS_MULTIPLEX from "../mocks/resultsMultiplex.mock";

import ResultsTable, { generateTableHeaders } from "./ResultsTable";

describe("Method generateTableHeaders", () => {
  const table = (headers: JSX.Element) => (
    <table>
      <thead>{headers}</thead>
    </table>
  );
  it("checks basic headers", () => {
    render(table(generateTableHeaders(false, false)));
    expect(
      screen.getByRole("columnheader", {
        name: new RegExp(`${PATIENT_TERM_CAP}`, "i"),
      })
    );
    expect(
      screen.getByRole("columnheader", { name: /Test date/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /COVID-19/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Test device/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Actions/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /flu a/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /flu b/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /facility b/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /submitted by/i })
    ).toBeInTheDocument();
  });
  it("checks multiplex headers", () => {
    render(table(generateTableHeaders(true, false)));
    expect(
      screen.getByRole("columnheader", { name: /flu a/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /flu b/i })
    ).toBeInTheDocument();
  });
  it("checks facility header", () => {
    render(table(generateTableHeaders(false, true)));
    expect(
      screen.getByRole("columnheader", { name: /facility/i })
    ).toBeInTheDocument();
  });
  it("checks submitted by header hides", () => {
    render(table(generateTableHeaders(true, true)));
    expect(
      screen.queryByRole("columnheader", {
        name: /Submitted by/i,
      })
    ).not.toBeInTheDocument();
  });
});

describe("Component ResultsTable", () => {
  const setPrintModalIdFn = jest.fn();
  const setMarkCorrectionIdFn = jest.fn();
  const setDetailsModalIdFn = jest.fn();
  const setTextModalIdFn = jest.fn();
  const setEmailModalTestResultIdFn = jest.fn();

  it("checks table without results", () => {
    render(
      <ResultsTable
        results={[]}
        setPrintModalId={setPrintModalIdFn}
        setMarkCorrectionId={setMarkCorrectionIdFn}
        setDetailsModalId={setDetailsModalIdFn}
        setTextModalId={setTextModalIdFn}
        setEmailModalTestResultId={setEmailModalTestResultIdFn}
        hasMultiplexResults={false}
        hasFacility={false}
      />
    );

    expect(
      screen.getByRole("cell", { name: /no results/i })
    ).toBeInTheDocument();
  });

  it("checks table with results", () => {
    render(
      <ResultsTable
        results={TEST_RESULTS_MULTIPLEX}
        setPrintModalId={setPrintModalIdFn}
        setMarkCorrectionId={setMarkCorrectionIdFn}
        setDetailsModalId={setDetailsModalIdFn}
        setTextModalId={setTextModalIdFn}
        setEmailModalTestResultId={setEmailModalTestResultIdFn}
        hasMultiplexResults={false}
        hasFacility={false}
      />
    );

    TEST_RESULTS_MULTIPLEX.forEach((result) => {
      expect(
        screen.getByTestId(`test-result-${result.internalId}`)
      ).toBeInTheDocument();
    });
  });

  describe("actions menu", () => {
    describe("text result action", () => {
      it("includes `Text result` if patient has mobile number", () => {
        const testResultPatientMobileNumber = [TEST_RESULTS_MULTIPLEX[1]];

        render(
          <ResultsTable
            results={testResultPatientMobileNumber}
            setPrintModalId={setPrintModalIdFn}
            setMarkCorrectionId={setMarkCorrectionIdFn}
            setDetailsModalId={setDetailsModalIdFn}
            setTextModalId={setTextModalIdFn}
            setEmailModalTestResultId={setEmailModalTestResultIdFn}
            hasMultiplexResults={false}
            hasFacility={false}
          />
        );

        const moreActions = within(screen.getByRole("table")).getAllByRole(
          "button"
        )[1];

        userEvent.click(moreActions);

        // Action menu is open
        expect(screen.getByText("Print result")).toBeInTheDocument();
        expect(screen.getByText("Text result")).toBeInTheDocument();
      });

      it("does not include `Text result` if no patient mobile number", () => {
        const testResultPatientNoMobileNumber = [TEST_RESULTS_MULTIPLEX[0]];

        render(
          <ResultsTable
            results={testResultPatientNoMobileNumber}
            setPrintModalId={setPrintModalIdFn}
            setMarkCorrectionId={setMarkCorrectionIdFn}
            setDetailsModalId={setDetailsModalIdFn}
            setTextModalId={setTextModalIdFn}
            setEmailModalTestResultId={setEmailModalTestResultIdFn}
            hasMultiplexResults={false}
            hasFacility={false}
          />
        );

        const moreActions = within(screen.getByRole("table")).getAllByRole(
          "button"
        )[1];

        userEvent.click(moreActions);

        // Action menu is open
        expect(screen.getByText("Print result")).toBeInTheDocument();
        expect(screen.queryByText("Text result")).not.toBeInTheDocument();
      });
    });
    describe("email result action", () => {
      it("includes `Email result` if patient email address", () => {
        const testResultPatientEmail = [TEST_RESULTS_MULTIPLEX[0]];

        render(
          <ResultsTable
            results={testResultPatientEmail}
            setPrintModalId={setPrintModalIdFn}
            setMarkCorrectionId={setMarkCorrectionIdFn}
            setDetailsModalId={setDetailsModalIdFn}
            setTextModalId={setTextModalIdFn}
            setEmailModalTestResultId={setEmailModalTestResultIdFn}
            hasMultiplexResults={false}
            hasFacility={false}
          />
        );

        const moreActions = within(screen.getByRole("table")).getAllByRole(
          "button"
        )[1];

        userEvent.click(moreActions);

        // Action menu is open
        expect(screen.getByText("Print result")).toBeInTheDocument();
        expect(screen.getByText("Email result")).toBeInTheDocument();
      });

      it("does not include `Email result` if no patient email address", () => {
        const testResultPatientNoEmail = [TEST_RESULTS_MULTIPLEX[1]];

        render(
          <ResultsTable
            results={testResultPatientNoEmail}
            setPrintModalId={setPrintModalIdFn}
            setMarkCorrectionId={setMarkCorrectionIdFn}
            setDetailsModalId={setDetailsModalIdFn}
            setTextModalId={setTextModalIdFn}
            setEmailModalTestResultId={setEmailModalTestResultIdFn}
            hasMultiplexResults={false}
            hasFacility={false}
          />
        );

        const moreActions = within(screen.getByRole("table")).getAllByRole(
          "button"
        )[1];

        userEvent.click(moreActions);

        // Action menu is open
        expect(screen.getByText("Print result")).toBeInTheDocument();
        expect(screen.queryByText("Email result")).not.toBeInTheDocument();
      });
    });
  });
});
