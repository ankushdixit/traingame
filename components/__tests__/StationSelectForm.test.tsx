import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StationSelectForm from "../StationSelectForm";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("StationSelectForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe("initial render", () => {
    it("renders with correct initial state", () => {
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      const destinationSelect = screen.getByLabelText("Get off at");
      const submitButton = screen.getByRole("button", { name: "Start Game" });

      expect(boardingSelect).toHaveValue("");
      expect(destinationSelect).toHaveValue("");
      expect(submitButton).toBeDisabled();
    });

    it("renders boarding dropdown with 5 stations (excludes Dadar)", () => {
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      const options = boardingSelect.querySelectorAll("option");

      // 5 stations + 1 placeholder option
      expect(options).toHaveLength(6);
      expect(options[0]).toHaveTextContent("Select station...");
      expect(options[1]).toHaveTextContent("Churchgate");
      expect(options[2]).toHaveTextContent("Marine Lines");
      expect(options[3]).toHaveTextContent("Charni Road");
      expect(options[4]).toHaveTextContent("Grant Road");
      expect(options[5]).toHaveTextContent("Mumbai Central");
    });

    it("renders destination dropdown disabled initially", () => {
      render(<StationSelectForm />);

      const destinationSelect = screen.getByLabelText("Get off at");
      expect(destinationSelect).toBeDisabled();
    });
  });

  describe("boarding station selection", () => {
    it("enables destination dropdown after selecting boarding station", async () => {
      const user = userEvent.setup();
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      const destinationSelect = screen.getByLabelText("Get off at");

      await user.selectOptions(boardingSelect, "0"); // Churchgate

      expect(destinationSelect).toBeEnabled();
    });

    it("shows all 5 destinations when Churchgate is selected", async () => {
      const user = userEvent.setup();
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      await user.selectOptions(boardingSelect, "0"); // Churchgate

      const destinationSelect = screen.getByLabelText("Get off at");
      const options = destinationSelect.querySelectorAll("option");

      // 5 destinations + 1 placeholder
      expect(options).toHaveLength(6);
      expect(options[1]).toHaveTextContent("Marine Lines");
      expect(options[2]).toHaveTextContent("Charni Road");
      expect(options[3]).toHaveTextContent("Grant Road");
      expect(options[4]).toHaveTextContent("Mumbai Central");
      expect(options[5]).toHaveTextContent("Dadar");
    });

    it("shows only Dadar when Mumbai Central is selected", async () => {
      const user = userEvent.setup();
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      await user.selectOptions(boardingSelect, "4"); // Mumbai Central

      const destinationSelect = screen.getByLabelText("Get off at");
      const options = destinationSelect.querySelectorAll("option");

      // 1 destination + 1 placeholder
      expect(options).toHaveLength(2);
      expect(options[1]).toHaveTextContent("Dadar");
    });

    it("resets destination when boarding station changes", async () => {
      const user = userEvent.setup();
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      const destinationSelect = screen.getByLabelText("Get off at");

      // Select Churchgate and Marine Lines as destination
      await user.selectOptions(boardingSelect, "0");
      await user.selectOptions(destinationSelect, "1");

      expect(destinationSelect).toHaveValue("1");

      // Change boarding station to Marine Lines
      await user.selectOptions(boardingSelect, "1");

      // Destination should be reset
      expect(destinationSelect).toHaveValue("");
    });
  });

  describe("button state", () => {
    it("keeps button disabled when only boarding is selected", async () => {
      const user = userEvent.setup();
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      const submitButton = screen.getByRole("button", { name: "Start Game" });

      await user.selectOptions(boardingSelect, "0");

      expect(submitButton).toBeDisabled();
    });

    it("enables button when both stations are selected", async () => {
      const user = userEvent.setup();
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      const destinationSelect = screen.getByLabelText("Get off at");
      const submitButton = screen.getByRole("button", { name: "Start Game" });

      await user.selectOptions(boardingSelect, "0");
      await user.selectOptions(destinationSelect, "5");

      expect(submitButton).toBeEnabled();
    });

    it("disables button again when destination is cleared", async () => {
      const user = userEvent.setup();
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      const destinationSelect = screen.getByLabelText("Get off at");
      const submitButton = screen.getByRole("button", { name: "Start Game" });

      // Select both
      await user.selectOptions(boardingSelect, "0");
      await user.selectOptions(destinationSelect, "5");
      expect(submitButton).toBeEnabled();

      // Clear destination
      await user.selectOptions(destinationSelect, "");
      expect(submitButton).toBeDisabled();
    });
  });

  describe("form submission", () => {
    it("navigates to game page with correct query params on submit", async () => {
      const user = userEvent.setup();
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      const destinationSelect = screen.getByLabelText("Get off at");
      const submitButton = screen.getByRole("button", { name: "Start Game" });

      await user.selectOptions(boardingSelect, "0"); // Churchgate
      await user.selectOptions(destinationSelect, "5"); // Dadar
      await user.click(submitButton);

      expect(mockPush).toHaveBeenCalledWith("/game?boarding=0&destination=5");
    });

    it("navigates with correct params for different station selection", async () => {
      const user = userEvent.setup();
      render(<StationSelectForm />);

      const boardingSelect = screen.getByLabelText("Board at");
      const destinationSelect = screen.getByLabelText("Get off at");
      const submitButton = screen.getByRole("button", { name: "Start Game" });

      await user.selectOptions(boardingSelect, "2"); // Charni Road
      await user.selectOptions(destinationSelect, "4"); // Mumbai Central
      await user.click(submitButton);

      expect(mockPush).toHaveBeenCalledWith("/game?boarding=2&destination=4");
    });

    it("does not navigate when form is invalid", async () => {
      render(<StationSelectForm />);

      const form = screen.getByRole("button", { name: "Start Game" }).closest("form");

      // Try to submit directly (bypassing disabled button)
      fireEvent.submit(form!);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
