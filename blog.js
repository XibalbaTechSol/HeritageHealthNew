/**
 * BLOG READER LOGIC — Heritage Health Services
 * Implements a premium article reader modal system.
 */

const articlesData = {
    'straight-vs-hmo': {
        title: "Straight Title 19 vs. Medicaid HMO: Understanding the Difference",
        category: "Medicaid Mastery",
        date: "May 20, 2026",
        readTime: "11 min read",
        image: "fa-code-compare",
        isIcon: true,
        content: `
            <h3>The Core Distinction: Administration vs. Eligibility</h3>
            <p>One of the most frequent points of confusion for Wisconsin families is the difference between "Straight Title 19" (Fee-for-Service Medicaid) and a Medicaid Health Maintenance Organization (HMO). It's important to understand that both are Medicaid programs with the same basic eligibility requirements. The difference lies entirely in how your care is managed and how providers are paid. At Heritage Health, we work with both models, but the clinical coordination required for each varies significantly.</p>
            
            <h3>Straight Title 19: The Traditional Model</h3>
            <p>Straight Title 19, or Fee-for-Service (FFS) Medicaid, is the traditional way the state pays for care. In this model, you can see any provider in Wisconsin that accepts Medicaid, and the state pays that provider directly for each service they deliver. There is no "middleman" insurance company. For many, this offers the widest possible network of doctors. However, it requires the family to be much more proactive in coordinating their own care, as there is no assigned HMO case manager to help bridge the gaps between different medical providers.</p>
            
            <h3>Medicaid HMOs: The Managed Care Model</h3>
            <p>A Medicaid HMO is a private insurance company (like iCare, My Choice Wisconsin, or UnitedHealthcare) that the state pays to manage your care. When you are in an HMO, you must generally stay within that company’s network of doctors and hospitals. The HMO receives a set monthly fee from the state to provide all of your necessary medical services. The primary benefit of an HMO is managed coordination—you often have access to a dedicated case manager who can help authorize services and ensure your various specialists are communicating with each other.</p>
            
            <h3>How it Affects Personal Care Services</h3>
            <p>From a personal care perspective, the main difference is the authorization process. For Straight Title 19, Heritage Health coordinates directly with a state-contracted agency to verify clinical necessity. For an HMO, we work directly with the insurance company's utilization management team. Some HMOs offer additional "value-added" benefits that Straight Medicaid does not, such as specialized wellness programs or increased transportation support. Our clinical team is expert at navigating the specific paperwork and authorization requirements for every major HMO in Southeast Wisconsin.</p>
            
            <h3>Choosing What's Best for Your Family</h3>
            <p>In most parts of Wisconsin, including Milwaukee and Racine counties, Medicaid recipients are required to choose an HMO unless they meet specific exemption criteria. However, certain "carve-out" services might still be paid via Straight Title 19 even if you are in an HMO. This complexity is why we recommend speaking with a Heritage Health coordinator or an ADRC specialist before making a change. We can help you look at your current doctors and your specific care needs to determine which model—managed or traditional—will provide the most seamless and supportive experience for your loved one.</p>
        `
    },
    'featured-guide': {
        title: "The Family Caregiver's Guide to Wisconsin Medicaid (2026 Edition)",
        category: "Medicaid Mastery",
        date: "April 23, 2026",
        readTime: "15 min read",
        image: "blog_page_top_1776920976022.png",
        content: `
            <h3>The Wisconsin Medicaid Landscape</h3>
            <p>Navigating the world of Medicaid (Title 19) in Wisconsin is often described as navigating a maze without a map. For families in Milwaukee, Racine, and Mt. Pleasant, the stakes are high—getting it right means your loved one can stay in their home, while getting it wrong can lead to premature facility placement. At Heritage Health, we see it as our mission to be that map. The 2026-2027 landscape has shifted, with more emphasis on "Self-Directed" care models that empower families more than ever before. However, with this empowerment comes a higher level of scrutiny regarding clinical documentation and medical necessity.</p>
            
            <h3>Financial Eligibility & The ADRC</h3>
            <p>The first hurdle is always financial. Wisconsin’s income and asset limits for Title 19 are strictly enforced, but they aren't always as simple as they look on paper. We always advise families to start their journey at their local Aging and Disability Resource Center (ADRC). These county-run offices are the gateway to eligibility. They will look at your loved one's assets, income, and any "spousal impoverishment" protections that might apply. It’s important to remember that qualifying for Medicaid is a legal and financial process that happens before Heritage Health can step in, but we are here to help you understand the terminology and point you toward the right resources to ensure your application is as strong as possible.</p>
            
            <h3>Medical Necessity: The RN Assessment</h3>
            <p>Once the financial hurdle is cleared, the clinical journey begins. This is where Heritage Health takes the lead. To receive personal care hours, a Registered Nurse must conduct a thorough assessment to prove "medical necessity." We don't just look at a diagnosis; we look at functional limitations. Can the patient safely get in and out of the shower? Can they manage their own hygiene? Are they at risk of falling when walking to the kitchen? Our RNs are trained to capture the "24-hour picture" of a patient’s life, ensuring that the state understands exactly why home health support is vital for their safety and well-being.</p>
            
            <h3>Choosing Your Caregiver: The Heritage Path</h3>
            <p>The most transformative part of the Wisconsin model is the ability to hire your own family members or friends. If you have been providing care for free, Heritage Health can transition you into a professional, compensated Personal Care Worker (PCW). We handle the background checks, the clinical training, and the ongoing supervision. This ensures that the care being delivered is not only rooted in the love and trust of a family relationship but is also backed by professional clinical standards. This "dual-layer" of care—familial heart and clinical expertise—is what makes Heritage Health different.</p>
            
            <h3>Continuous Clinical Support</h3>
            <p>Enrollment is just the beginning. Once you are part of the Heritage family, you have 24/7 access to our clinical team. Our Registered Nurses perform regular "oversight visits" to ensure the Plan of Care is still meeting the patient's needs and to mentor the caregiver on new clinical techniques. Whether it's managing a new medication or learning how to use a transfer lift safely, we are your partners every step of the way. We believe that by supporting the caregiver, we are ultimately providing the best possible care for the patient.</p>
        `
    },
    'clinical-oversight': {
        title: "Nurse Rachel on Clinical Oversight & Home Safety",
        category: "Video Article",
        date: "April 23, 2026",
        readTime: "4:20 Watch Time",
        image: "blog_nurse_rachel_1776921412461.png",
        content: `
            <h3>Beyond the Basics: What Clinical Oversight Means</h3>
            <p>At Heritage Health, clinical oversight is far more than a regulatory requirement—it is the cornerstone of our "Quality-First" philosophy. Many agencies view the RN visit as a formality to be completed every 60 days. We view it as an opportunity for clinical intervention. Our Registered Nurses are not just checking boxes; they are looking for the subtle "warning signs" of health decline, such as changes in gait, skin turgor, or cognitive clarity. By catching these signs early, we can coordinate with physicians to adjust treatment plans before a minor issue becomes an emergency room visit.</p>
            
            <h3>The Safety Audit: Protecting the Home Environment</h3>
            <p>A significant part of our oversight involves a rigorous Home Safety Audit. We evaluate the physical environment for hazards that increase the risk of falls—the leading cause of injury for seniors in Wisconsin. We look at everything from rug placement and hallway lighting to the height of the patient's bed. Our nurses provide actionable recommendations to families on how to optimize their space for safety, often suggesting simple modifications like grab bars or improved lighting that can make a life-changing difference in a client's independence.</p>
            
            <h3>Caregiver Mentorship: Elevating the Standard of Care</h3>
            <p>Clinical oversight also extends to the mentorship of our Personal Care Workers (PCWs). We believe that a well-supported caregiver provides a higher standard of care. During our oversight visits, we spend time observing the PCW's techniques and providing real-time coaching. This isn't about "policing" their work; it's about empowering them with the clinical knowledge they need to succeed. Whether it's perfecting a transfer technique or understanding the signs of caregiver burnout, our RNs are there to support the person who is on the front lines of care every day.</p>
            
            <h3>Outcomes & Readmission Prevention</h3>
            <p>The ultimate goal of our clinical oversight is to improve patient outcomes and prevent hospital readmissions. When a patient is discharged from the hospital, the first few days at home are the most dangerous. Our "Quick-Response" oversight model ensures that an RN is involved immediately during this transition phase. We reconcile medications, update the Plan of Care, and ensure the PCW is fully briefed on the new requirements. This level of clinical vigilance is why Heritage Health remains a trusted partner for medical providers throughout Southeast Wisconsin.</p>
        `
    },
    'get-paid-to-care': {
        title: "Deep Dive: How the 'Get Paid to Care' Program Works",
        category: "Video Article",
        date: "April 22, 2026",
        readTime: "6:15 Watch Time",
        image: "care-photo.png",
        content: `
            <h3>Addressing the \"Unpaid Caregiver\" Crisis</h3>
            <p>Thousands of families across Wisconsin are currently trapped in a cycle of unpaid caregiving. Daughters are quitting their jobs to care for aging parents, and spouses are sacrificing their retirement savings to provide 24/7 support. This is what we call the \"Unpaid Caregiver Crisis.\" At Heritage Health, we believe that the work you do as a family caregiver is professional-grade labor, and it should be compensated as such. The 'Get Paid to Care' program is a Medicaid-funded initiative that allows us to hire family members to provide the care their loved ones already need.</p>
            
            <h3>The Mechanics of Compensation</h3>
            <p>How does it work? Once your loved one is enrolled in Wisconsin Medicaid (Title 19) and our RN determines they qualify for personal care hours, we can bring you onto our payroll. You become an employee of Heritage Health, which means you receive a competitive hourly wage, weekly direct deposit, and the protection of worker's compensation. This financial support can change the entire dynamic of a household, allowing the caregiver to focus on their loved one's health without the constant stress of financial instability.</p>
            
            <h3>Clinical Training & Professional Growth</h3>
            <p>We don't just put you on the payroll; we invest in your professional development. Every Heritage Health caregiver undergoes our specialized PCW training program. This curriculum covers essential clinical skills, from infection control and medication reminders to body mechanics and emergency protocols. Many of our family caregivers find that this training gives them a new level of confidence in their role, turning them from \"helpers\" into \"clinical professionals\" who are fully equipped to handle the complexities of home care.</p>
            
            <h3>The Heritage Support System</h3>
            <p>Being a paid caregiver with Heritage Health means you are never alone. You have a dedicated team of nurses and coordinators backing you up. If a patient's condition changes, you have a nurse you can call for advice. If you have questions about your hours or the EVV system, our office team is there to help. This support system is designed to prevent caregiver burnout—a common issue for those doing this work in isolation. We are your partners in care, ensuring that both you and your loved one can thrive in the home environment.</p>
        `
    },
    'evv-rules': {
        title: "April 2026: New EVV Compliance Rules for Wisconsin Agencies",
        category: "Forward Health Update",
        date: "April 21, 2026",
        readTime: "5 min read",
        image: "fa-file-medical-flag",
        isIcon: true,
        content: `
            <h3>The Evolution of Electronic Visit Verification</h3>
            <p>Electronic Visit Verification (EVV) is not a new concept, but its implementation in Wisconsin has become increasingly sophisticated. As of April 2026, the Department of Health Services (DHS) has rolled out its most comprehensive set of compliance rules yet. These updates are part of a federal mandate designed to ensure that Medicaid-funded personal care services are actually being delivered. For caregivers and families, understanding these rules is not just about \"checking in\"—it's about protecting the funding that makes your care possible.</p>
            
            <h3>Real-Time Documentation: The New Standard</h3>
            <p>One of the most significant changes in the April 2026 update is the move toward \"point-of-care\" documentation. Previously, there was some flexibility in when tasks were logged. Now, DHS requires that the specific tasks performed—such as grooming, meal preparation, or assistance with mobility—be documented at the time of the visit using the approved mobile application. This real-time data allows the state to see a clear correlation between the authorized Plan of Care and the actual services delivered, significantly reducing the risk of billing errors or audits.</p>
            
            <h3>GPS Validation & Privacy Protocols</h3>
            <p>The updated rules also include enhanced GPS validation. When a caregiver \"clocks in\" or \"clocks out,\" the system captures a one-time GPS coordinate to verify they are at the patient's authorized residence. We often hear concerns from caregivers about privacy, and it’s important to clarify: the system does *not* track you throughout the day. It only captures a snapshot at the start and end of the visit. Heritage Health has implemented strict data security protocols to ensure that this location data is used only for compliance purposes and is never shared beyond the necessary state reviewing agencies.</p>
            
            <h3>Training & Technical Support for PCWs</h3>
            <p>We know that new technology can be intimidating. That’s why Heritage Health provides comprehensive, one-on-one training for every caregiver on the new EVV software. We don't just hand you an app; we walk you through it until you feel 100% confident. Our office team also monitors the EVV feeds in real-time. If we see that a clock-in didn't register or a task list was missed, we proactively reach out to help you fix it before it becomes a payroll issue. Our goal is to make compliance as effortless as possible so you can focus on what you do best: caring for your family.</p>
        `
    },
    'dementia-care': {
        title: "5 Clinical Strategies for Managing Dementia at Home",
        category: "Clinical Excellence",
        date: "April 15, 2026",
        readTime: "12 min read",
        image: "blog_dementia_care_1776921660891.png",
        content: `
            <h3>Understanding the Clinical Nature of Dementia</h3>
            <p>Caring for a loved one with dementia is one of the most complex clinical challenges a home caregiver can face. As a nurse, I always tell families: \"You are not arguing with your mother; you are arguing with a disease.\" Dementia physically changes the brain, affecting memory, logic, and emotional regulation. To manage this effectively at home, we must move beyond simple \"supervision\" and adopt specific clinical strategies that de-escalate tension and promote a sense of safety for the patient.</p>
            
            <h3>1. The Power of a Predictable Routine</h3>
            <p>For a brain that is losing its grasp on time and place, routine is a lifeline. Keeping meals, baths, and sleep times identical every single day creates a \"rhythm of safety.\" When a patient knows what to expect next, their baseline anxiety levels drop significantly. This consistency also helps regulate the body’s circadian rhythm, which can reduce \"sundowning\"—the increased confusion and agitation that many dementia patients experience in the late afternoon and evening hours.</p>
            
            <h3>2. Communication: Simplicity & Eye Contact</h3>
            <p>As dementia progresses, the brain’s ability to process complex language diminishes. We teach our caregivers to use the \"One-at-a-Time\" rule: one question, one instruction, one topic. Speak slowly, use a gentle tone, and always maintain eye contact at the patient's level. If you are standing over them, it can feel threatening. By positioning yourself appropriately and simplifying your speech, you remove the \"cognitive noise\" that often leads to frustration and behavioral outbursts.</p>
            
            <h3>3. Validation Therapy vs. Reality Orientation</h3>
            <p>One of the hardest shifts for family caregivers is learning to stop correcting the patient. If your father says he needs to go to work (even though he’s been retired for thirty years), telling him he’s retired will likely lead to an argument. Instead, use Validation Therapy. Ask him about his job. \"What kind of work did you do?\" \"You must have worked very hard.\" By validating the *feeling* behind the statement rather than the *fact*, you maintain a connection and avoid a power struggle that neither of you can win.</p>
            
            <h3>4. Environmental Optimization</h3>
            <p>The home environment plays a massive role in dementia management. Over-stimulation is a major trigger for agitation. We recommend reducing background noise (like a constantly running TV) and minimizing clutter. Additionally, visual cues can be life-changing. Using high-contrast colors (like a red plate on a white table) can help a patient see their food more clearly, while placing simple signs on doors (like \"Bathroom\") can reduce the confusion that leads to accidents and anxiety.</p>
            
            <h3>5. The Necessity of Caregiver Respite</h3>
            <p>You cannot provide high-quality dementia care if you are running on empty. Caregiver burnout is not just a feeling; it is a clinical reality that can lead to health problems for the caregiver and a decrease in the quality of care for the patient. Heritage Health’s services are designed to provide you with the respite you need. Whether it’s a few hours a week to run errands or a full day to rest, taking time for yourself is a vital part of your loved one's care plan. Remember: you are the most important piece of equipment in the home. You must be maintained.</p>
        `
    },
    'enrollment-step-by-step': {
        title: "Step-by-Step: Enrolling in the 'Get Paid to Care' Program",
        category: "Caregiver Support",
        date: "April 10, 2026",
        readTime: "8 min read",
        image: "blog_caregiver_choice_1776921688508.png",
        content: `
            <h3>Phase 1: The Initial Discovery Call</h3>
            <p>Your journey with Heritage Health begins with a simple, no-pressure discovery call. During this time, our intake specialists will listen to your story. We want to understand who needs care, what their physical and cognitive challenges are, and who in the family is interested in providing that care. We’ll perform a preliminary screen for Medicaid eligibility and explain the different programs available in Southeast Wisconsin. Our goal is to provide you with clarity from the very first minute, so you know exactly what to expect in the weeks ahead.</p>
            
            <h3>Phase 2: Medicaid Verification & ADRC Coordination</h3>
            <p>Once we’ve determined that the 'Get Paid to Care' program is a good fit, the next step is formalizing the care recipient's Medicaid (Title 19) status. If they aren't already enrolled, we will guide you on how to contact your county's Aging and Disability Resource Center (ADRC). We act as your clinical advocates during this phase, helping you understand the terminology and the documentation required by the state. This phase is about ensuring the \"financial foundation\" is in place so that the clinical work can proceed without delay.</p>
            
            <h3>Phase 3: The RN Home Assessment</h3>
            <p>This is the most critical step in the enrollment process. One of our Registered Nurses will visit your home to conduct a comprehensive clinical assessment. We look at the recipient's ability to perform Activities of Daily Living (ADLs) and identify any risks to their safety or health. This information is used to create an official \"Plan of Care\"—a document that outlines exactly what support is needed and how many hours the state will authorize. This plan is reviewed and signed by the patient's primary physician, ensuring it meets all professional medical standards.</p>
            
            <h3>Phase 4: Caregiver Onboarding & Training</h3>
            <p>While the Plan of Care is being finalized, we begin the onboarding process for the family caregiver. This includes a standard background check and the completion of our specialized PCW training course. We want to ensure you feel fully equipped with the clinical knowledge and technical skills needed to provide high-quality care. We also set you up on our user-friendly EVV system and walk you through the payroll process, so you know exactly how and when you will be compensated for your vital work.</p>
            
            <h3>Phase 5: The Start of Care</h3>
            <p>Once all the pieces are in place—the Plan of Care is approved, the training is complete, and the state has issued the authorization—care officially begins! But our relationship doesn't end there. You will have ongoing oversight from our RN team and 24/7 support from our office. We are here to ensure that as your loved one's needs change, their care plan changes with them. You are now a professional part of the Heritage Health team, providing excellence in care within the comfort of your own home.</p>
        `
    },
    'medicaid-qualification': {
        title: "How to Qualify for Title 19 Personal Care in SE Wisconsin",
        category: "Medicaid Mastery",
        date: "April 5, 2026",
        readTime: "10 min read",
        image: "blog_medicaid_guide_1776921431703.png",
        content: `
            <h3>Understanding the Dual-Pronged Qualification</h3>
            <p>Qualifying for Title 19 (Medicaid) personal care in Wisconsin is a two-part process. It's not enough to simply have a low income, and it's not enough to simply have a medical condition. You must meet both the financial and the clinical requirements set by the state. For many families in Southeast Wisconsin, this can feel like a daunting hurdle. At Heritage Health, we break this down into manageable steps, acting as your clinical guides through a process that can often take several weeks to complete.</p>
            
            <h3>Prong 1: Financial Eligibility</h3>
            <p>Financial eligibility is determined by the state and focuses on the applicant's income and countable assets. These limits change annually and vary based on the specific Medicaid program (such as Family Care or IRIS). However, it is important to know that there are \"spousal impoverishment\" rules that protect a portion of a couple's assets if only one spouse needs care. We always recommend consulting with an elder law expert or your local ADRC to ensure you are presenting your financial picture accurately and taking advantage of all legal protections.</p>
            
            <h3>Prong 2: Medical Necessity (Functional Screen)</h3>
            <p>Even if you meet the financial limits, the state must agree that the care is \"medically necessary.\" This is determined through a \"Functional Screen,\" which evaluates the applicant's need for help with Activities of Daily Living (ADLs) such as bathing, dressing, toileting, and mobility. The state isn't just looking for a diagnosis (like \"heart disease\" or \"dementia\"); they are looking for how that diagnosis prevents the person from living safely without assistance. This is where the documentation provided by a Heritage Health RN becomes invaluable.</p>
            
            <h3>Navigating the Assessment with Confidence</h3>
            <p>When the state or the ADRC conducts their assessment, it's vital that the family is prepared. We advise our clients to be completely honest about their \"worst days.\" Many seniors have a tendency to minimize their struggles during an assessment out of pride. However, if the assessor doesn't see the full picture of the need, the authorized hours will not be sufficient to provide safe care. Our clinical team helps families prepare for these conversations, ensuring that the assessor understands the true level of support required to keep the loved one safe at home.</p>
            
            <h3>The Role of Heritage Health in Your Qualification</h3>
            <p>While we do not make the final eligibility determination, Heritage Health plays a critical role in the process. Once you are deemed eligible by the ADRC, we step in to provide the professional RN assessment and the official Plan of Care. We also coordinate with your physician to ensure they are on board with the transition to home care. Our goal is to make the jump from \"eligible\" to \"enrolled\" as seamless as possible, so you can stop worrying about the paperwork and start focusing on the care.</p>
        `
    },
    'behavioral-health-2027': {
        title: "Forward Health Bulletin: Behavioral Health Integration 2027",
        category: "Forward Health Update",
        date: "April 28, 2026",
        readTime: "7 min read",
        image: "fa-brain",
        isIcon: true,
        content: `
            <h3>A Holistic Shift in Wisconsin Home Care</h3>
            <p>The Wisconsin Department of Health Services (DHS) has released a landmark Forward Health Bulletin detailing the integration of behavioral health into the personal care model, set to take full effect in 2027. This move represents a significant evolution in how we view home health. For too long, physical care and mental health were treated as separate silos. The 2027 mandates recognize that for our seniors and individuals with disabilities, emotional well-being is a primary driver of physical health outcomes. This integration is designed to catch issues like depression, anxiety, and social isolation before they lead to physical decline.</p>
            
            <h3>The New Screening Mandates</h3>
            <p>Beginning in early 2027, every RN assessment and every regular oversight visit must include a standardized behavioral health screening. These tools are designed to be non-intrusive but clinically revealing. They look for subtle shifts in mood, changes in social engagement, and signs of cognitive distress. At Heritage Health, we are already pilot-testing these screening protocols with our clinical team. By training our nurses to ask the right questions and observe the right behaviors, we can identify mental health needs that might have previously been overlooked in a traditional \"physical-only\" assessment.</p>
            
            <h3>Empowering Caregivers with Behavioral Training</h3>
            <p>The 2027 integration isn't just for the nurses; it’s for the Personal Care Workers (PCWs) too. Our family caregivers are with the patients every day, making them the most important \"early warning system\" we have. Heritage Health is updating its curriculum to include behavioral health modules that teach PCWs how to recognize the symptoms of depression in seniors and how to provide \"emotional first aid.\" We want our caregivers to feel as confident managing a client's anxiety as they do managing their medication. This holistic approach empowers the caregiver to provide a much deeper level of support.</p>
            
            <h3>Coordinating Care for Better Outcomes</h3>
            <p>The ultimate goal of behavioral health integration is better coordination with the broader medical community. When a Heritage Health RN identifies a behavioral health concern, we now have a formal pathway to communicate that finding to the patient's primary care physician and insurance case manager. This ensures that the patient gets the resources they need—whether it’s a medication adjustment, a referral to a specialist, or increased social support—long before a crisis occurs. We are proud to be leading the way in Southeast Wisconsin in implementing this proactive, whole-person care model.</p>
        `
    },
    'smart-care-evv': {
        title: "Advanced EVV: Preparing for the 2027 'Smart-Care' Mandates",
        category: "Medicaid Mastery",
        date: "April 30, 2026",
        readTime: "9 min read",
        image: "fa-mobile-screen-button",
        isIcon: true,
        content: `
            <h3>Moving From Verification to Value</h3>
            <p>The Electronic Visit Verification (EVV) system is undergoing its most radical transformation since its inception. The upcoming 2027 'Smart-Care' mandates represent a shift from simple \"verification\" (proving you were there) to \"value-based reporting\" (proving the care made a difference). The Wisconsin DHS is moving toward a model where agencies must demonstrate the clinical impact of their visits. This means that the data captured by our caregivers every day will become a vital part of the patient's overall medical record, used by the state to determine the effectiveness of the home care program.</p>
            
            <h3>Qualitative Documentation in Real-Time</h3>
            <p>Under the new mandates, caregivers will be asked to go beyond the \"Checklist\" model. Currently, a PCW might just check a box saying \"Bathing Assisted.\" Starting in 2027, the 'Smart-Care' system will require brief, qualitative inputs on the patient’s status. Did they seem more confused today? Was their skin intact? Did they have a good appetite? Heritage Health is already developing a customized version of our mobile app that makes this documentation quick and intuitive. We want to ensure that our caregivers can provide this vital clinical data without it feeling like a \"paperwork burden\" that takes away from their time with their loved ones.</p>
            
            <h3>The Role of Artificial Intelligence in Compliance</h3>
            <p>To manage this new influx of data, the Wisconsin DHS is implementing AI-driven audit tools that look for patterns in care delivery. These tools are designed to identify \"high-performing\" caregivers and agencies that are consistently delivering positive outcomes. At Heritage Health, we welcome this transparency. Our RNs already use data to drive their oversight visits, and the 'Smart-Care' mandates simply formalize the high standards we have always set for ourselves. By embracing these technological shifts, we ensure that our agency—and our caregivers—remain the gold standard for compliance in the state.</p>
            
            <h3>Protecting the Future of Home Care</h3>
            <p>Why is this shift happening? Ultimately, it's about protecting the future of Medicaid-funded home care. By proving that personal care services lead to fewer hospitalizations and better patient health, we can advocate for continued (and even increased) funding for these programs. Heritage Health is committed to being the \"Smart-Care\" leader in Southeast Wisconsin. We provide the technology, the training, and the clinical support needed to ensure that our caregivers are not just compliant, but are recognized as the professional healthcare providers they truly are.</p>
        `
    },
    'transition-guidelines-2027': {
        title: "2027 DHS Facility-to-Home Transition Guidelines",
        category: "Clinical Excellence",
        date: "May 5, 2026",
        readTime: "12 min read",
        image: "fa-house-medical-circle-check",
        isIcon: true,
        content: `
            <h3>The 'Golden 72 Hours' Protocol</h3>
            <p>The Wisconsin Department of Health Services (DHS) has identified the first 72 hours following a discharge from a skilled nursing facility as the most critical window for patient safety. Starting in 2027, new guidelines will mandate a \"High-Touch\" transition protocol for all personal care agencies. This protocol is designed to eliminate the \"Transition Gap\"—that period of confusion where medications are misunderstood, safety equipment isn't yet in place, and the caregiver isn't fully briefed on the new Plan of Care. At Heritage Health, we are already implementing these standards as our default clinical practice.</p>
            
            <h3>RN-Led Reconciliation & Safety Audit</h3>
            <p>Under the 2027 guidelines, a Registered Nurse must conduct an in-home visit within the first 24 hours of discharge. This isn't just a social call; it is a rigorous clinical reconciliation. We compare the hospital's discharge orders with the medications actually in the home, ensuring there are no dangerous overlaps or omissions. We also perform a safety audit to ensure that any new medical equipment—such as a hospital bed or a walker—is set up correctly and that the caregiver knows how to use it safely. This RN-led intervention is the most effective way to prevent the \"revolving door\" of hospital readmissions.</p>
            
            <h3>Coordinating the Care Team</h3>
            <p>A successful transition requires perfect communication between the hospital, the personal care agency, and the family. The 2027 mandates require a more formal \"Hand-Off\" process. Heritage Health has established direct lines of communication with discharge planners at all major Southeast Wisconsin hospitals. We ensure that before the patient even leaves the facility, our team has the records we need and a caregiver is scheduled for the moment the patient arrives home. This seamless coordination removes the stress from the family during what is often a very emotional and exhausting time.</p>
            
            <h3>Training for Post-Acute Care</h3>
            <p>Often, a patient returning from a facility has new clinical needs that the family caregiver hasn't handled before. Whether it's wound care management, new dietary restrictions, or specialized physical therapy exercises, Heritage Health provides immediate, targeted training. Our nurses spend the first few days working closely with the PCW, mentoring them on these new tasks until they feel 100% confident. By elevating the caregiver's skills to meet the patient's new clinical reality, we ensure a successful transition and a long-term return to independence in the home.</p>
        `
    },
    'iris-vs-family-care': {
        title: "IRIS vs. Family Care: Navigating Your Options in Wisconsin",
        category: "Medicaid Mastery",
        date: "May 10, 2026",
        readTime: "12 min read",
        image: "fa-scale-balanced",
        isIcon: true,
        content: `
            <h3>The Two Pillars of Wisconsin Long-Term Care</h3>
            <p>In Wisconsin, once you are determined eligible for Medicaid long-term care, you are typically faced with a choice between two primary programs: Family Care and IRIS (Include, Respect, I Self-Direct). This choice is one of the most important decisions a family can make, as it determines how much control you have over your services, who provides them, and how your budget is managed. As a Registered Nurse, I often see families struggle to understand the clinical and administrative differences between these two paths. Our goal at Heritage Health is to help you weigh these options so you can choose the one that best supports your loved one's unique needs.</p>
            
            <h3>Family Care: Managed Care for Peace of Mind</h3>
            <p>Family Care is a managed care model. In this program, you work with a Managed Care Organization (MCO) that coordinates all of your services. You are assigned a care team, usually consisting of a social worker and a nurse, who help develop your care plan and authorized services. The benefit of Family Care is the "one-stop-shop" approach—the MCO handles the logistics, the billing, and the provider network. This is often an excellent choice for families who want a high level of professional coordination and don't want to deal with the complexities of managing their own budget or hiring and firing their own staff.</p>
            
            <h3>IRIS: The Power of Self-Direction</h3>
            <p>IRIS, on the other hand, is a self-directed program. Instead of a managed care team, you are given a set monthly budget based on your functional needs, and you decide how to spend it. You act as the employer of your own caregivers (with the help of a fiscal agent). This offers the ultimate level of flexibility and independence. If you want to hire a specific family member or friend and have complete control over your schedule, IRIS is often the preferred choice. However, it requires a higher level of administrative responsibility from the family, as you are responsible for managing the budget and ensuring compliance with state rules.</p>
            
            <h3>Making the Right Clinical Choice</h3>
            <p>When deciding between the two, we look at the patient's clinical stability and the family's support system. If a patient has complex, rapidly changing medical needs that require frequent coordination with various specialists, the managed care support of Family Care can be invaluable. If the patient's condition is stable and the family is highly motivated to take an active role in their own care management, the flexibility of IRIS can lead to a much higher quality of life. At Heritage Health, we work with families in both programs, providing the professional personal care services and RN oversight that ensure success regardless of which pillar you choose.</p>
        `
    },
    'spousal-impoverishment': {
        title: "Medicaid Spousal Impoverishment Rules: Protecting Your Assets",
        category: "Medicaid Mastery",
        date: "May 15, 2026",
        readTime: "10 min read",
        image: "fa-shield-halved",
        isIcon: true,
        content: `
            <h3>The Fear of \"Spending Down\" to Poverty</h3>
            <p>One of the most common fears I hear from married couples is that they will have to spend every last penny they've saved for retirement before one spouse can qualify for Medicaid home care. There is a terrifying misconception that the \"healthy\" spouse (the community spouse) will be left with nothing. Fortunately, Wisconsin has robust \"Spousal Impoverishment\" protections designed specifically to prevent this. These rules recognize that the community spouse needs to maintain their own independence and financial security while their partner receives the essential care they need.</p>
            
            <h3>The Community Spouse Resource Allowance (CSRA)</h3>
            <p>Under Wisconsin's rules, the community spouse is allowed to keep a significant portion of the couple's assets. This is known as the Community Spouse Resource Allowance (CSRA). While the specific limits are updated annually, the core principle remains: the state calculates the couple's total countable assets and then \"splits\" them, allowing the community spouse to retain a substantial amount (up to a state-defined maximum). This ensures that the healthy spouse isn't forced into poverty just because their partner requires personal care services to stay safe in their home.</p>
            
            <h3>Income Protections: The Monthly Maintenance Needs Allowance</h3>
            <p>In addition to assets, Medicaid also protects the community spouse's income. If the community spouse's own income is below a certain threshold, they may be entitled to a portion of the institutionalized spouse's income to help cover their own living expenses. This is called the Monthly Maintenance Needs Allowance (MMNA). This protection is vital for ensuring that the community spouse can continue to pay their mortgage, utilities, and other essential costs. At Heritage Health, we encourage families to work with an elder law attorney or a qualified Medicaid planner to ensure these income and asset transfers are handled correctly during the application process.</p>
            
            <h3>Why Early Planning is Essential</h3>
            <p>The spousal impoverishment rules are a powerful tool, but they are also complex. Navigating the asset split and the income allowance requires careful documentation and a deep understanding of Wisconsin DHS policy. We always advise couples to start this planning early—long before the need for care becomes a crisis. By understanding your rights and the protections available to you, you can approach the Medicaid application process with confidence rather than fear, knowing that Heritage Health is here to provide the clinical support that turns that eligibility into a reality of high-quality, in-home care.</p>
        `
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('articleModal');
    const modalBody = modal.querySelector('.modal-body-inner');
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    function openArticle(id) {
        const data = articlesData[id];
        if (!data) return;

        // Populate content
        modal.querySelector('.modal-category').textContent = data.category;
        modal.querySelector('.modal-title').textContent = data.title;
        modal.querySelector('.modal-date').textContent = data.date;
        modal.querySelector('.modal-read-time').textContent = data.readTime;

        // Image logic
        const imgContainer = modal.querySelector('.modal-featured-image');
        if (data.isIcon) {
            imgContainer.innerHTML = `<div style="background: var(--navy); height: 100%; display: flex; align-items: center; justify-content: center;"><i class="fa-solid ${data.image}" style="font-size: 8rem; color: var(--gold);"></i></div>`;
        } else {
            imgContainer.innerHTML = `<img src="${data.image}" alt="${data.title}">`;
        }

        modalBody.innerHTML = data.content;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Scroll to top of modal
        modal.querySelector('.modal-container').scrollTop = 0;
    }

    function closeArticle() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Attach listeners to all cards
    document.querySelectorAll('[data-article-id]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-article-id');
            openArticle(id);
        });
    });

    closeBtn.addEventListener('click', closeArticle);
    overlay.addEventListener('click', closeArticle);

    // Escape key to close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeArticle();
        }
    });
});
