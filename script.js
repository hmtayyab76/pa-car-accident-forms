class MultiStepForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.steps = this.form.querySelectorAll(".step");
        this.currentStep = 0;
        this.continueBtns = this.form.querySelectorAll(".continue-btn");
        this.backBtns = this.form.querySelectorAll(".back-btn");
        this.inputs = this.form.querySelectorAll("input, select, textarea");

        this.init();
    }

    // Initialize the form
    init() {
        this.addEventListeners();
        this.showStep(this.currentStep);
        this.createInjurySelect(); // Dynamically add injury options
    }

    // Show the current step
    showStep(stepIndex) {
        this.steps[this.currentStep].classList.remove("active");
        this.currentStep = stepIndex;
        this.steps[this.currentStep].classList.add("active");
        this.validateInputs();
    }

    // Add event listeners
    addEventListeners() {
        // Continue button listeners
        this.form.querySelector("#continue-1").addEventListener("click", () => this.showStep(1));
        this.form.querySelector("#continue-2").addEventListener("click", () => this.showStep(2));
        this.form.querySelector("#continue-3").addEventListener("click", () => this.showStep(3));
        this.form.querySelector("#continue-4").addEventListener("click", () => alert("Thank you for submitting!"));

        // Back button listeners
        this.form.querySelector("#back-2").addEventListener("click", () => this.showStep(0));
        this.form.querySelector("#back-3").addEventListener("click", () => this.showStep(1));

        // Input listeners for real-time validation
        this.inputs.forEach(input => input.addEventListener("input", () => this.validateInputs()));

        // Radio button listeners for Step 2
        this.form.querySelectorAll(".radio-btn").forEach(button => {
            button.addEventListener("click", () => {
                this.toggleRadioSelection(button);
                this.checkFormCompletion();
            });
        });
    }

    // Validate inputs for the current step
    validateInputs() {
        const currentStepInputs = this.steps[this.currentStep].querySelectorAll("input, select, textarea");
        let isValid = true;

        currentStepInputs.forEach(input => {
            if (input.type === "checkbox" && !input.checked) {
                isValid = false;
            } else if (!input.value) {
                isValid = false;
            }

            if (this.currentStep === 2) {
                if (input.id === "email" && !this.validateEmail(input.value)) {
                    isValid = false;
                }
                if (input.id === "phone" && !this.validatePhoneNumber(input.value)) {
                    isValid = false;
                }
            }
        });

        // Check radio button validation for Step 2
        if (this.currentStep === 1) {
            const radioButtons = this.form.querySelectorAll(".radio-btn.selected");
            const totalRadioButtons = this.form.querySelectorAll(".radio-group .radio-btn").length;
            if (radioButtons.length !== totalRadioButtons / 2) {
                isValid = false;
            }
        }

        // Enable or disable the continue button
        this.continueBtns[this.currentStep].disabled = !isValid;
    }

    // Validate email format
    validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    // Validate phone number format
    validatePhoneNumber(phone) {
        const phonePattern = /^[0-9]{10,}$/; // Minimum 10 digits
        return phonePattern.test(phone);
    }

    // Create the injury options dynamically
    createInjurySelect() {
        const injuryOptions = [
            "Car Accident", "Motorcycle Accident", "18 Wheeler Accident", "Dog Bite",
            "Slip and Fall", "Pedestrian", "Bicycle Accident", "Other Accident"
        ];

        const injurySelect = document.createElement('select');
        injurySelect.id = "how-injury";
        injurySelect.required = true;

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "-- Select --";
        injurySelect.appendChild(defaultOption);

        // Add dynamic options
        injuryOptions.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText.toLowerCase().replace(/ /g, '-'); // Convert spaces to dashes
            option.textContent = optionText;
            injurySelect.appendChild(option);
        });

        // Append the new select element to the form
        const injuryLabel = this.form.querySelector("label[for='how-injury']");
        injuryLabel.insertAdjacentElement('afterend', injurySelect);
    }

    // Toggle the selected class for radio buttons
    toggleRadioSelection(button) {
        this.form.querySelectorAll(`[name='${button.name}']`).forEach(btn => {
            btn.classList.remove("selected");
        });
        button.classList.add("selected");
    }

    // Check if all radio buttons for Step 2 are selected
    checkFormCompletion() {
        const continueBtn = this.form.querySelector("#continue-2");
        const allSelected = this.form.querySelectorAll(".radio-btn.selected").length === this.form.querySelectorAll(".radio-group .radio-btn").length / 2;

        continueBtn.disabled = !allSelected;
    }

    // Lead rejection based on conditions (from PDF)
    rejectLead() {
        const accidentType = this.form.querySelector("#how-injury").value;
        const injuries = this.form.querySelector("input[name='injuries']:checked");
        const estimatedBills = this.form.querySelector("#medical-treatment").value;
        const haveAttorney = this.form.querySelector("input[name='attorney-help']:checked");

        // Reject lead based on conditions
        if (injuries && injuries.value === "No" && estimatedBills === "None") {
            alert("Lead rejected: No injuries and no estimated medical bills.");
            return false;
        }

        if (haveAttorney && haveAttorney.value === "Yes") {
            alert("Lead rejected: Attorney already helping.");
            return false;
        }

        // More rejection conditions based on the PDF (add similar checks here)
        return true;
    }
}

// Initialize the multi-step form
const multiStepForm = new MultiStepForm("#multi-step-form");
