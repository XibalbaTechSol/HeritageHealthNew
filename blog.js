/**
 * BLOG READER LOGIC — Heritage Health Services
 * Implements a premium article reader modal system with clinical-grade content.
 * Author: Registered Nurse (RN) clinical team.
 */

const articlesData = {
    'pcs-vs-ltc': {
        title: "Personal Care vs. Long-Term Care: A Clinical Guide for Families",
        category: "Clinical Excellence",
        date: "May 25, 2026",
        readTime: "15 min read",
        image: "fa-stethoscope",
        isIcon: true,
        content: `
            <p>In my years of clinical practice as a Registered Nurse, I have encountered countless families who feel overwhelmed by the complex terminology of Wisconsin Medicaid. Two of the most frequently conflated terms are "Personal Care" and "Long-Term Care." While they both fall under the umbrella of home-based support, they represent distinct clinical levels of intervention and administrative pathways. Understanding these differences is not merely an academic exercise; it is essential for ensuring that vulnerable individuals receive the specific intensity of care required to maintain their health and dignity at home.</p>

            <p>Personal Care Services (PCS) are defined by the <a href="https://www.dhs.wisconsin.gov/medicaid/pcc.htm" target="_blank">Wisconsin Department of Health Services</a> as "Medicaid Card Services" intended to assist with Activities of Daily Living (ADLs). From a nursing perspective, PCS is a task-oriented medical benefit. It focuses on the immediate physical needs of the patient—such as bathing, dressing, grooming, and mobility—that must be performed to prevent a decline in health. Because PCS is an entitlement benefit, any individual who meets the medical necessity criteria through a physician’s order can access these services without being subject to the waitlists often associated with broader social programs.</p>

            <p>In contrast, Long-Term Care (LTC) programs like <a href="https://www.dhs.wisconsin.gov/familycare/index.htm" target="_blank">Family Care and IRIS</a> are holistic systems designed for individuals who meet a "Nursing Home Level of Care." While PCS focuses on the *tasks* of care, LTC focuses on the *environment* and *social integration* of the individual. LTC benefits extend beyond medical needs to include home modifications, specialized transportation, and vocational support. To qualify, a resident must undergo a rigorous <a href="https://www.dhs.wisconsin.gov/adrc/pros/functional-screen.htm" target="_blank">Functional Screen</a> administered by the state, which proves that without comprehensive intervention, facility placement would be imminent.</p>

            <p>The clinical coordination between these two paths is where Heritage Health Services excels. Many of our clients are enrolled in LTC programs for their broad support needs but choose Heritage Health specifically to manage their Personal Care tasks. This "hybrid" approach allows for the highest standard of clinical oversight. As an RN, I oversee the specific Plan of Care for PCS, ensuring that the caregiver’s tasks are performed safely and effectively, while the LTC case manager handles the broader life-supports like specialized equipment or home ramps.</p>

            <p>Ultimately, the choice between or the integration of these programs depends on the complexity of the patient's condition. If your loved one only needs assistance with physical hygiene and medical tasks, Straight Personal Care may be sufficient. However, if they require significant environmental changes or community support to remain safe, a Long-Term Care program is vital. We recommend that families consult with their primary care physician and a Heritage Health coordinator to determine which clinical path provides the safest foundation for aging in place.</p>

            <div class="mla-citation" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;">
                <h4 style="color: #333; margin-bottom: 15px;">Works Cited</h4>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "Personal Care Services." <em>DHS Wisconsin</em>, 15 Jan. 2024, <a href="https://www.dhs.wisconsin.gov/medicaid/pcc.htm" target="_blank">www.dhs.wisconsin.gov/medicaid/pcc.htm</a>.</p>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "Family Care: Long-Term Care for Adults." <em>DHS Wisconsin</em>, 10 Mar. 2024, <a href="https://www.dhs.wisconsin.gov/familycare/index.htm" target="_blank">www.dhs.wisconsin.gov/familycare/index.htm</a>.</p>
                <p style="margin-bottom: 8px;">U.S. Centers for Medicare & Medicaid Services. "Home & Community Based Services." <em>Medicaid.gov</em>, 2024, <a href="https://www.medicaid.gov/medicaid/hcbs/index.html" target="_blank">www.medicaid.gov/medicaid/hcbs/index.html</a>.</p>
            </div>
        `
    },
    'mapp-program': {
        title: "Clinical & Financial Independence: The Wisconsin MAPP Program",
        category: "Medicaid Mastery",
        date: "May 22, 2026",
        readTime: "15 min read",
        image: "fa-briefcase-medical",
        isIcon: true,
        content: `
            <p>As a nurse, I believe that healthcare should empower individuals rather than limit their potential. For many Wisconsin residents with disabilities, the fear of losing Medicaid benefits—and the essential personal care that comes with them—often prevents them from pursuing meaningful employment. The <a href="https://www.dhs.wisconsin.gov/medicaid/mapp.htm" target="_blank">Medicaid Purchase Plan (MAPP)</a> is a revolutionary clinical and financial tool designed to break this cycle. It allows individuals with disabilities to work, earn a competitive income, and save for their future while maintaining the full spectrum of their healthcare coverage.</p>

            <p>The core clinical advantage of MAPP lies in its expanded eligibility thresholds. Traditional Medicaid programs often have strict asset limits as low as $2,000, which can feel like a "poverty trap" for those trying to improve their lives. Under <a href="https://www.dhs.wisconsin.gov/publications/p1/p10071.pdf" target="_blank">2026 MAPP guidelines</a>, the individual asset limit is increased to $15,000. This shift allows our patients to maintain a financial safety net, which directly correlates with reduced stress and improved long-term mental health outcomes, all while continuing to receive RN-supervised care in their homes.</p>

            <p>Furthermore, MAPP encourages true financial growth through the use of "Independence Accounts." These accounts allow a worker to save a significant portion of their earnings without those funds counting toward the $15,000 asset limit. From a clinical perspective, this is vital because it allows patients to save for life-enhancing items not always covered by insurance, such as modified vehicles or specialized home fitness equipment. According to the <a href="https://www.ssa.gov/disability" target="_blank">Social Security Administration</a>, maintaining employment and financial goals is a key factor in the "social determinants of health," leading to higher levels of patient engagement and adherence to medical plans.</p>

            <p>Eligibility for MAPP is broad, encompassing anyone over 18 who meets the Social Security disability standard and is "working." Wisconsin defines work in a way that respects the diverse abilities of its citizens, including self-employment and "in-kind" work. For those transitioning into the workforce, the <a href="https://www.dhs.wisconsin.gov/disabilities/wda/index.htm" target="_blank">Health and Employment Counseling (HEC)</a> program provides a 12-month window of coverage while the individual searches for a job. This ensures that their clinical needs—including their personal care workers from Heritage Health—are fully funded during the stressful period of job seeking.</p>

            <p>In conclusion, the MAPP program represents the "gold standard" of disability policy by recognizing that employment and healthcare are complementary, not contradictory. At Heritage Health, we take pride in supporting our MAPP members, as they often have a $0 cost-share for their long-term care services once their monthly premium is paid. By utilizing MAPP, individuals with disabilities in Southeast Wisconsin can achieve professional success without sacrificing the clinical support they need to thrive. We encourage all working adults with disabilities to explore this path toward a more independent life.</p>

            <div class="mla-citation" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;">
                <h4 style="color: #333; margin-bottom: 15px;">Works Cited</h4>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "Medicaid Purchase Plan (MAPP) Consumer Guide." <em>DHS Wisconsin</em>, Feb. 2024, <a href="https://www.dhs.wisconsin.gov/medicaid/mapp.htm" target="_blank">www.dhs.wisconsin.gov/medicaid/mapp.htm</a>.</p>
                <p style="margin-bottom: 8px;">Social Security Administration. "Disability Benefits: Working While Disabled." <em>SSA.gov</em>, 2024, <a href="https://www.ssa.gov/pubs/EN-05-10095.pdf" target="_blank">www.ssa.gov/pubs/EN-05-10095.pdf</a>.</p>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "Employment Resources for People with Disabilities." <em>DHS Wisconsin</em>, 12 Apr. 2024, <a href="https://www.dhs.wisconsin.gov/disabilities/wda/index.htm" target="_blank">www.dhs.wisconsin.gov/disabilities/wda/index.htm</a>.</p>
            </div>
        `
    },
    'adrc-racine': {
        title: "Navigating the Gateway: The ADRC of Racine County",
        category: "Caregiver Support",
        date: "June 1, 2026",
        readTime: "14 min read",
        image: "fa-building-columns",
        isIcon: true,
        content: `
            <p>In the clinical journey of a patient, the most critical step is often the very first one: finding accurate information. For residents of Racine County, that first step is the <a href="https://www.adrc.racinecounty.com/" target="_blank">Aging and Disability Resource Center (ADRC)</a>. As a nurse working in the home care sector, I view the ADRC as an indispensable clinical partner. They serve as the unbiased "gateway" to nearly all publicly funded long-term care services in Wisconsin, providing families with the clarity needed to navigate a complex and often frightening healthcare landscape.</p>

            <p>One of the primary clinical roles of the ADRC is conducting the <a href="https://www.dhs.wisconsin.gov/adrc/index.htm" target="_blank">Long-Term Care Functional Screen</a>. This assessment is the "gold standard" for determining if an individual requires a nursing home level of care. When a family contacts Heritage Health for services, we almost always direct them to the ADRC first to ensure they are properly screened. This objective evaluation ensures that patients are matched with the appropriate program—whether it be Family Care or IRIS—ensuring that their clinical needs are met by the right level of professional staffing.</p>

            <p>Beyond screening, the ADRC provides access to "Benefit Specialists" who act as dedicated advocates for the patient. In my practice, I have seen how these specialists can transform a family's experience by helping them understand <a href="https://www.medicare.gov" target="_blank">Medicare</a>, Social Security, and Medicaid rights. They assist with the daunting paperwork of enrollment and can even help resolve disputes with insurance companies. Having a local expert in Sturtevant who understands both the state regulations and the local Racine County resources is a massive advantage for ensuring continuous, uninterrupted care.</p>

            <p>The ADRC’s impact also extends to the "Social Determinants of Health" through their community support programs. They manage the <a href="https://www.dhs.wisconsin.gov/nutrition/index.htm" target="_blank">Senior Nutrition Program (Meals on Wheels)</a> and offer specialized "Caregiver Support" groups that provide essential respite and education. For a nurse, seeing a patient have access to proper nutrition and seeing a family caregiver have emotional support is just as important as the medical care we provide in the home. These resources create a safety net that prevents clinical crises and keeps our seniors safe and independent.</p>

            <p>In summary, the ADRC of Racine County is the clinical anchor for our community’s most vulnerable residents. Whether you are in the city of Racine, Mt. Pleasant, or Burlington, their office at 14200 Washington Ave is your primary resource for long-term planning. At Heritage Health, we value our close collaboration with the ADRC staff, as it allows us to provide a seamless transition from "seeking help" to "receiving care." I encourage every family facing a new diagnosis or an aging-related transition to call the ADRC at 262-833-8777 and begin their journey with professional guidance.</p>

            <div class="mla-citation" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;">
                <h4 style="color: #333; margin-bottom: 15px;">Works Cited</h4>
                <p style="margin-bottom: 8px;">Racine County. "Aging & Disability Resource Center (ADRC) of Racine County." <em>RacineCounty.com</em>, 2024, <a href="https://www.adrc.racinecounty.com" target="_blank">www.adrc.racinecounty.com</a>.</p>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "What is an ADRC?" <em>DHS Wisconsin</em>, 5 Jan. 2024, <a href="https://www.dhs.wisconsin.gov/adrc/index.htm" target="_blank">www.dhs.wisconsin.gov/adrc/index.htm</a>.</p>
                <p style="margin-bottom: 8px;">U.S. Administration on Aging. "Aging and Disability Resource Centers." <em>ACL.gov</em>, 2024, <a href="https://acl.gov/programs/aging-and-disability-networks/adrcs" target="_blank">acl.gov/programs/aging-and-disability-networks/adrcs</a>.</p>
            </div>
        `
    },
    'wkrp-consortium': {
        title: "Administrative Advocacy: The Role of the WKRP Consortium",
        category: "Medicaid Mastery",
        date: "May 28, 2026",
        readTime: "12 min read",
        image: "fa-users-rectangle",
        isIcon: true,
        content: `
            <p>As a Registered Nurse, I understand that clinical excellence cannot exist without administrative stability. In Kenosha and Racine counties, that stability is maintained by the <a href="https://www.dhs.wisconsin.gov/forwardhealth/imagency.htm" target="_blank">WKRP (Wisconsin's Kenosha Racine Partners)</a> consortium. WKRP is the multi-county agency responsible for the "Income Maintenance" (IM) side of the Medicaid journey. While nurses at Heritage Health focus on your physical well-being, the specialists at WKRP focus on your eligibility, ensuring that the financial foundation of your care remains secure and compliant with state law.</p>

            <p>The primary function of WKRP is to manage the <a href="https://www.dhs.wisconsin.gov/medicaid/index.htm" target="_blank">Medicaid and BadgerCare Plus</a> application process. When a family in our region applies for public assistance, WKRP is the entity that verifies income, assets, and household composition. From a clinical perspective, WKRP acts as the "verifier" of the Medicaid card. Without a valid, active status through WKRP, the professional personal care services we provide cannot be authorized. Therefore, we view the relationship between the patient and their WKRP caseworker as a vital part of the overall clinical plan.</p>

            <p>Communication with WKRP is often the most stressful part of the Medicaid process for families. The <a href="https://www.dhs.wisconsin.gov/forwardhealth/imagency.htm" target="_blank">WKRP Call Center (1-888-794-5820)</a> is a high-volume resource where residents can report changes in income, update their address, or check the status of a pending renewal. In my clinical oversight, I frequently remind families to "never ignore a letter from WKRP." A single missed form can lead to a lapse in coverage, which can unfortunately lead to an immediate interruption of the home care services that keep a patient safe. Prompt and accurate communication with the consortium is a clinical necessity.</p>

            <p>WKRP also plays a critical role in the annual "Medicaid Renewal" process, often called the <a href="https://www.dhs.wisconsin.gov/forwardhealth/renewals.htm" target="_blank">Annual Administrative Review</a>. During this time, the consortium re-evaluates the family’s finances to ensure they still meet the Medicaid standards. As your nursing team, Heritage Health acts as an administrative advocate during this period. We help our clients gather the necessary documentation and coordinate with WKRP to ensure that there are no gaps in the authorization of care. We believe that by reducing the administrative burden on the family, we directly improve the patient's quality of life.</p>

            <p>In conclusion, the WKRP consortium is the silent partner in the healthcare of Kenosha and Racine residents. By understanding their role in income maintenance and eligibility, families can better navigate the system and protect their access to life-sustaining services. At Heritage Health, we are committed to working hand-in-hand with WKRP to ensure that every "Medicaid Card" is backed by a professional, RN-led support system. If you have questions about your current status, we recommend utilizing the <a href="https://access.wisconsin.gov/" target="_blank">ACCESS.wi.gov</a> portal as your primary tool for managing your WKRP case.</p>

            <div class="mla-citation" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;">
                <h4 style="color: #333; margin-bottom: 15px;">Works Cited</h4>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "Income Maintenance (IM) Consortia." <em>DHS Wisconsin</em>, 2024, <a href="https://www.dhs.wisconsin.gov/forwardhealth/imagency.htm" target="_blank">www.dhs.wisconsin.gov/forwardhealth/imagency.htm</a>.</p>
                <p style="margin-bottom: 8px;">ForwardHealth. "Medicaid and BadgerCare Plus Renewals." <em>ForwardHealth Wisconsin</em>, 2024, <a href="https://www.dhs.wisconsin.gov/forwardhealth/renewals.htm" target="_blank">www.dhs.wisconsin.gov/forwardhealth/renewals.htm</a>.</p>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "ACCESS: Check your benefits." <em>ACCESS Wisconsin</em>, 2024, <a href="https://access.wisconsin.gov/" target="_blank">access.wisconsin.gov/</a>.</p>
            </div>
        `
    },
    'straight-vs-hmo': {
        title: "Managed vs. Traditional: Straight Title 19 vs. Medicaid HMOs",
        category: "Medicaid Mastery",
        date: "May 20, 2026",
        readTime: "14 min read",
        image: "fa-code-compare",
        isIcon: true,
        content: `
            <p>In the complex ecosystem of Wisconsin healthcare, one of the most critical decisions a family must navigate is the choice between "Straight Title 19" and a Medicaid HMO. As a Registered Nurse, I often explain this as the difference between "Traditional Freedom" and "Managed Coordination." While both programs are funded by Medicaid and offer the same essential benefits, the clinical path to accessing care—and the way providers like Heritage Health are authorized to work with you—varies significantly between the two models.</p>

            <p>Straight Title 19, also known as <a href="https://www.dhs.wisconsin.gov/medicaid/index.htm" target="_blank">Fee-for-Service (FFS) Medicaid</a>, is the traditional version of the program. In this model, the state of Wisconsin acts as the primary payer. Clinically, this offers the widest possible access to providers, as you can see any doctor or specialist in the state that accepts the "Medicaid Card." For families, this means no network restrictions; however, it also means there is no central insurance coordinator to help manage your specialists. Under Straight Title 19, Heritage Health works directly with state-contracted clinical screeners to authorize your personal care services.</p>

            <p>On the other hand, a Medicaid <a href="https://www.dhs.wisconsin.gov/badgercareplus/hmo-map.htm" target="_blank">Health Maintenance Organization (HMO)</a> is a private insurance company (such as iCare, My Choice Wisconsin, or UnitedHealthcare) that the state pays to manage your care. The primary clinical benefit of an HMO is "Managed Care." These companies often provide a dedicated case manager to help coordinate your doctors and authorize your home care. However, you are generally restricted to the HMO's specific network of providers. At Heritage Health, we maintain contracts with nearly all major HMOs in Southeast Wisconsin to ensure that our clinical standards are available to all members, regardless of their plan choice.</p>

            <p>In many Wisconsin counties, including Milwaukee and Racine, enrollment in an HMO is <a href="https://www.dhs.wisconsin.gov/forwardhealth/enrollment-info.htm" target="_blank">mandatory for most Medicaid recipients</a>. There are, however, certain "carve-out" situations where specific services—such as certain high-intensity clinical procedures or specialized mental health services—might still be paid via Straight Medicaid even if the patient is in an HMO. This overlapping of authority can be confusing for families, which is why having an RN-led team at Heritage Health is so vital. We act as your clinical interpreters, navigating the specific paperwork and authorization rules required by your specific HMO.</p>

            <p>Ultimately, whether you are on Straight Title 19 or enrolled in an HMO, the goal of Heritage Health remains the same: providing the highest quality personal care in the comfort of your home. We recommend that families review the <a href="https://www.dhs.wisconsin.gov/guide/index.htm" target="_blank">HMO Enrollment Guide</a> provided by the state to understand their current plan and any upcoming enrollment periods. By understanding the administrative structure of your Medicaid benefit, you can better advocate for the clinical resources your loved one deserves. Our intake team is always available to help you verify your current coverage and explain the authorization path for your specific plan.</p>

            <div class="mla-citation" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;">
                <h4 style="color: #333; margin-bottom: 15px;">Works Cited</h4>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "BadgerCare Plus and Medicaid HMOs." <em>DHS Wisconsin</em>, 2024, <a href="https://www.dhs.wisconsin.gov/badgercareplus/hmo-map.htm" target="_blank">www.dhs.wisconsin.gov/badgercareplus/hmo-map.htm</a>.</p>
                <p style="margin-bottom: 8px;">ForwardHealth. "Enrollment Information for Wisconsin Medicaid." <em>ForwardHealth Wisconsin</em>, 10 Jan. 2024, <a href="https://www.dhs.wisconsin.gov/forwardhealth/enrollment-info.htm" target="_blank">www.dhs.wisconsin.gov/forwardhealth/enrollment-info.htm</a>.</p>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "Consumer Guide to Health Care." <em>DHS Wisconsin</em>, 2024, <a href="https://www.dhs.wisconsin.gov/guide/index.htm" target="_blank">www.dhs.wisconsin.gov/guide/index.htm</a>.</p>
            </div>
        `
    },
    'featured-guide': {
        title: "The Family Caregiver's Guide to Wisconsin Medicaid (2026 Edition)",
        category: "Medicaid Mastery",
        date: "April 23, 2026",
        readTime: "15 min read",
        image: "blog_page_top_1776920976022.png",
        isIcon: false,
        content: `
            <p>As a nurse who has spent years visiting families in their homes, I have seen the incredible dedication of family caregivers across Wisconsin. Often, these individuals are performing the work of a professional nurse or personal care worker without any formal support or compensation. In Wisconsin, however, the <a href="https://www.dhs.wisconsin.gov/medicaid/index.htm" target="_blank">Medicaid program</a> offers a unique and compassionate benefit: the ability for families to choose their own caregivers and, in many cases, for those caregivers to get paid for their work. This guide is my clinical "Plan of Action" for families looking to navigate this transition safely and professionally.</p>

            <p>The clinical foundation of getting paid to care for a loved one begins with the "Medical Necessity" standard. To qualify for a paid caregiver through Medicaid, the patient must require assistance with Activities of Daily Living (ADLs) as determined by a physician's order and an <a href="https://www.dhs.wisconsin.gov/medicaid/pcc.htm" target="_blank">RN assessment</a>. These ADLs include critical tasks like bathing, dressing, medication management, and mobility. At Heritage Health, our nurses conduct these assessments with a focus on patient safety, ensuring that the level of care assigned is appropriate for the patient's medical condition and physical limitations.</p>

            <p>Once medical necessity is established, the next step is choosing the right program: Agency-Led or Self-Directed. Under the <a href="https://www.dhs.wisconsin.gov/iris/index.htm" target="_blank">IRIS (Include, Respect, I Self-Direct)</a> program, families have the highest level of control, allowing them to hire and manage their own caregivers directly. Conversely, programs like Family Care offer a more managed approach through an agency like Heritage Health. In my experience, the choice depends on the family's comfort level with administrative tasks. IRIS offers more freedom, while an agency-led model provides more clinical oversight and support, ensuring that all caregivers are properly trained and supervised by a Registered Nurse.</p>

            <p>A critical component of this journey that families often overlook is training and safety. Even if a caregiver is a daughter, son, or spouse, providing professional-level personal care requires a clinical mindset. At Heritage Health, we provide our family caregivers with the same rigorous <a href="https://www.dhs.wisconsin.gov/caregiver/index.htm" target="_blank">training resources</a> as our professional staff. This includes body mechanics to prevent injury, infection control protocols, and specialized training for conditions like dementia or mobility issues. As an RN, my goal is to ensure that the "Family Caregiver" is empowered with the skills of a "Professional Caregiver," creating a safer environment for everyone involved.</p>

            <p>In conclusion, the ability to get paid to care for a loved one is more than just a financial benefit; it is a clinical strategy that promotes better outcomes by keeping patients in a familiar, loving environment. By following the state's <a href="https://www.dhs.wisconsin.gov/guide/index.htm" target="_blank">Medicaid guidelines</a> and partnering with a clinical team like Heritage Health, you can transform your role from a silent advocate into a supported professional. I encourage every family caregiver to take the first step by requesting a professional nursing assessment. Your care is valuable, and Wisconsin Medicaid recognizes that by giving you the tools to succeed. Let us help you navigate the path from compassion to clinical excellence.</p>

            <div class="mla-citation" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;">
                <h4 style="color: #333; margin-bottom: 15px;">Works Cited</h4>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "IRIS (Include, Respect, I Self-Direct)." <em>DHS Wisconsin</em>, 2024, <a href="https://www.dhs.wisconsin.gov/iris/index.htm" target="_blank">www.dhs.wisconsin.gov/iris/index.htm</a>.</p>
                <p style="margin-bottom: 8px;">Wisconsin Department of Health Services. "Caregiver Support and Resources." <em>DHS Wisconsin</em>, 12 Mar. 2024, <a href="https://www.dhs.wisconsin.gov/caregiver/index.htm" target="_blank">www.dhs.wisconsin.gov/caregiver/index.htm</a>.</p>
                <p style="margin-bottom: 8px;">ForwardHealth. "Medicaid Personal Care Services Manual." <em>ForwardHealth Wisconsin</em>, 2024, <a href="https://www.forwardhealth.wi.gov/WIPortal/Default.aspx" target="_blank">www.forwardhealth.wi.gov/WIPortal/Default.aspx</a>.</p>
            </div>
        `
    }
};

/**
 * MODAL UI LOGIC
 */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('articleModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const closeBtn = document.querySelector('.close-modal');

    function openArticle(id) {
        const data = articlesData[id];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalMeta.innerHTML = `<span><i class="fa-regular fa-calendar"></i> ${data.date}</span><span><i class="fa-regular fa-clock"></i> ${data.readTime}</span>`;
        modalBody.innerHTML = data.content;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeArticle() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Event Delegation for Blog Cards
    document.querySelector('.blog-grid').addEventListener('click', (e) => {
        const card = e.target.closest('.blog-card');
        if (card) {
            openArticle(card.dataset.articleId);
        }
    });

    closeBtn.addEventListener('click', closeArticle);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeArticle();
    });

    // Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeArticle();
        }
    });
});
