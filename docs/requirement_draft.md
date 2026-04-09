* AI Chatbot that assist users on filling in the form and answer user questions  
* Analytic dashboard  
  * Admin  
  * User  
* Login/Registration  
  * Admin \- Only invited email can register as admin  
  * General user- register through general email  
* Verify application form using LLM  
  * Generate verification  report to show which part got errors  
* Checklist to help user keep track on application progress

**Workflow**  
**Applicants**

1. Registration  
2. User fill form  
3. Verify application  
4. Update application status  
   4.1. Verify application form using LLM  
   4.2. Sent application to pejabat  
   4.3. Admin manual checking  
   4.4.1 Success  
   4.4.2. Rejected  
5. Gmail notification when application success

- Checklist to help user checking which document haven’t completed (Need to use caching)

**Admin**

1. Registration  
   1.1. Only invited email can register as admin  
2. Allow manual checking  
3. Analytics dashboard  
- Total no. of applications  
- No. of applications successful  
- No. of applications processing  
- No. of applications rejected  
4. After application completed, generate a report

