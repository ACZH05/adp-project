# 📄 Requirement Draft

## 🧩 Features

- AI Chatbot that assists users in filling forms and answering questions  
- Analytics Dashboard  
  - Admin  
  - User  
- Login / Registration  
  - Admin: Only invited emails can register  
  - General User: Open registration via email  
- Application Verification using LLM  
  - Generates a report highlighting errors  
- Checklist System  
  - Helps users track application progress  
- Appointment Page  
  - Users can request date & time  
  - Admin can approve/reject based on schedule  
  - If no action 1 day before → notify user that no admin is available  
  - Email notifications for appointment status  

---

## 🔄 Workflow

### 👤 Applicants

1. Registration  
2. Fill in application form  
3. Verify application  
4. Update application status  
   - 4.1 Verify application using LLM  
   - 4.2 Send application to pejabat  
   - 4.3 Admin manual checking  
   - 4.4 Result  
     - ✅ Success  
     - ❌ Rejected  
5. Receive Gmail notification upon success  
6. Appointment  
   - 6.1 Request date & time for physical submission  
   - Checklist system to track incomplete documents (uses caching)  

---

### 🛠️ Admin

1. Registration  
   - 1.1 Only invited emails allowed  
2. Manual application checking  
3. Analytics Dashboard  
   - Total number of applications  
   - Number of successful applications  
   - Number of applications in processing  
   - Number of rejected applications  
4. Generate report after application completion  
5. Approve / Reject appointment requests  

---

## 💡 Notes

- Checklist system requires caching mechanism  
- Email notifications are critical for both application and appointment updates  
- LLM is used for automated validation and reporting  
