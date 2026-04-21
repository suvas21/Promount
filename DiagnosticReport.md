# Booking Submission Diagnostic Report

This report outlines the detailed investigation of the "Confirm Booking" button logic and the overall submission flow across `BookingPage.jsx` and `BookingModal.jsx`.

## 1. Form Submission Logic
When a user attempts to click "Confirm Booking", the flow is governed by the `handleSubmit` function and the `disabled` attribute on the button itself. 

**The Silent Failure Flaw:** 
The primary issue users face is a "dead" or unresponsive button. This occurs because the button includes the prop `disabled={isBookButtonDisabled}` (which maps to `!isFormValid`). 
- When a user misses a required field (e.g., forgetting to check the Terms and Conditions or entering an invalid phone number), `isFormValid` evaluates to `false`.
- The HTML `disabled` attribute prevents the button from receiving click events.
- Because `onClick={handleSubmit}` cannot fire, the `validateAll()` function inside it never runs.
- **Result:** The user never receives the `useToast` notification ("Please fix the errors") nor the inline red error text. The form simply refuses to submit, appearing broken to the user.

## 2. Form Data Collection & Validation
A deep dive into the form state (`INITIAL_FORM_DATA`) and the validation algorithms (`validateAll` and `validateStep`) reveals significant gaps:

**Missing Step 1 & Step 2 Validation:**
- `isFormValid` in `BookingPage.jsx` and `isStep3Valid` in `BookingModal.jsx` *only* verify fields from Step 3 (`date`, `timeSlot`, `contact.phone`, `terms`, `smsConsent`).
- The components fail to validate any selections from Step 1 or Step 2. A user can scroll past the equipment/service selections, leaving `tvSize`, `mountType`, `wallType`, and `cableManagement` as `null`.
- Additionally, `contact.fullName`, `address.street`, and `address.city` are never checked for emptiness.

## 3. Backend Connection
The frontend attempts to submit data via a native `fetch` request to a Zoho Catalyst serverless function (`create_fsm_order`).

**Payload and API Vulnerabilities:**
- If the missing Step 1/Step 2 data (mentioned above) is dispatched to the backend, the Catalyst endpoint will likely fail to construct a valid Zoho FSM Service Request and return a `500 Internal Server Error` or `{ success: false }`.
- In `src/lib/zohoFSMService.js`, the payload maps names via: