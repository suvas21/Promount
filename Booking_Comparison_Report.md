# BookingPage.jsx vs BookingModal.jsx: Detailed Comparison Report

## 1. Form Structure and Field Names
Both components utilize the exact same underlying form data structures and child step components:
*   Both initialize form state using `INITIAL_FORM_DATA` imported from `@/lib/bookingUtils`.
*   Both use identical child components for form inputs: `<Step1>`, `<Step2>`, and `<Step3>`.
*   Both pass identical props to these steps: `formData`, `updateFormData`, `errors`, and `setErrors` (for Step 3).
*   **Difference in display**: `BookingPage.jsx` renders all three steps simultaneously in a vertical scrollable list. `BookingModal.jsx` renders them conditionally, one at a time, based on a `currentStep` state variable.

## 2. Validation Logic
*   **BookingPage.jsx**: Uses a `validateAll()` function that checks all required fields across all steps at once when the user attempts to submit. If validation fails, it shows a toast ("Please fix the errors") and smoothly scrolls the window to `top: 200`.
*   **BookingModal.jsx**: Uses a `validateStep(step)` function. Since fields are spread across steps, it only performs the comprehensive data validation (dates, times, phone, email, zip, terms, smsConsent) when `step === 3`. If validation fails, it shows the exact same toast but does **not** trigger a window scroll (as it's confined within a modal). 

## 3. Data Payload Structure Being Sent
*   **Identical**: Both components generate the exact same payload structure.
*   They both generate a confirmation number: ``PM-${dateStr}-${randomNum}``.
*   They both construct the payload by spreading `formData` and overriding the `contact` object to trim the name and format the phone number (`name: (formData.contact.fullName || '').trim()`, `phone: formatPhone(formData.contact.phone)`).

## 4. API Endpoints Being Called
*   **Identical**: Both components make a `POST` request to the exact same Catalyst Serverless API endpoint: 
    `https://promountbackend-914264443.development.catalystserverless.com/server/pro_mount_backend_function/create_fsm_order`

## 5. Error Handling and Error Display
*   Both `fetch` the response, parse the raw text, and attempt to parse JSON.
*   Both check `!response.ok` and `!result.success` and throw an error with the backend message or status text.
*   Both catch the error and log it to the console with `console.error("🔍 [DIAGNOSTIC] Page/Modal: Caught Error:", error)`.
*   **Difference in Toast Title**:
    *   `BookingPage.jsx` sets the error toast title to `"Booking Failed"`.
    *   `BookingModal.jsx` sets the error toast title to `"Booking Failed (Diagnostic Mode)"`.
*   **Difference in Toast Description**:
    *   `BookingPage.jsx` sets the description to `error.message || "An unknown error occurred while saving your booking."`
    *   `BookingModal.jsx` sets the description to `error.message || "An unknown error occurred. Check console."`

## 6. State Management and State Variables
*   **Shared States**: Both use `formData`, `errors`, `isSubmitting`, `isSuccess`, and `showMobileSummary`.
*   **BookingModal.jsx specific states**:
    *   `currentStep` (integer, initialized to 1) to track the active step in the wizard.
    *   Uses a `scrollContainerRef` to reset the modal's scroll position when steps change.
*   **BookingPage.jsx specific**: Relies strictly on native window scrolling, so no step tracking or container refs are used.

## 7. Wrapper Components and Providers
*   **BookingPage.jsx**:
    *   Wrapped in a standard `div` (`min-h-screen bg-navy-950 flex flex-col`).
    *   Includes SEO wrapper `<Helmet>` setting the page title and meta description.
    *   Includes global `<Header />` and `<Footer />` components.
    *   Uses `<main className="flex-grow pt-24 pb-32 lg:pb-16">` as the primary layout wrapper.
*   **BookingModal.jsx**:
    *   Uses React's `createPortal` to render directly into `document.body`.
    *   Wrapped in `<motion.div>` for Framer Motion entrance/exit animations (backdrop blur, slide-up physics).
    *   Has a close button (`<X>`) in its header and prevents body scrolling (`document.body.style.overflow = 'hidden'`) while open.

## 8. SuccessState Component Integration
*   Both render the `<SuccessState />` component identically when `isSuccess` is true.
*   **Difference in onClose Prop**:
    *   `BookingPage.jsx` passes `onClose={() => navigate('/')}` to redirect the user to the home page upon closure.
    *   `BookingModal.jsx` passes `onClose={handleClose}`, which triggers the modal's unmount sequence, resets the form locally, and restores body scrolling.

## 9. Any Other Differences in Logic, Styling, or Behavior
*   **Navigation / Wizard Logic**: `BookingModal.jsx` has `handleNext()` and `handleBack()` functions to navigate between the 3 steps, rendering `<ChevronLeft>` and `<ChevronRight>` buttons. `BookingPage.jsx` has a single permanent `handleSubmit` button at the bottom and in the mobile sticky footer.
*   **Close Confirmation**: `BookingModal.jsx` has a `handleClose()` function that intercepts closing if the user is past step 1 and hasn't completed the booking, triggering a native `window.confirm("Are you sure you want to close? Your booking progress will be lost.")`. `BookingPage.jsx` has no such concept since it's a standalone page.
*   **Step Indicators**: `BookingModal.jsx` features a visual progress indicator (colored bars) in the header to show which step the user is on. `BookingPage.jsx` uses numbered circles next to section headings within the scrollable content.
*   **Scroll Behavior**: `BookingModal.jsx` uses a `useEffect` on `[currentStep]` to reset `scrollContainerRef.current.scrollTop = 0`. `BookingPage.jsx` uses `window.scrollTo({ top: 0, behavior: 'smooth' })` on mount, reset, and successful submission.
*   **CSS overrides**: `BookingPage.jsx` includes a `<style>` block to hide a floating widget: `.fixed.bottom-6.right-6.z-\\[60\\] { display: none !important; }`. The modal does not do this.