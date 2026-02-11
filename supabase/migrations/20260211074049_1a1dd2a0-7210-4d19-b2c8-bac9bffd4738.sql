
-- Create modules for Public Health Project Management Essentials (966f0d0c-0855-4aa2-821d-3c023d883cd0)
-- Keep existing "Introduction" module, add more

-- Module 2: Project Planning & Design
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b1a10001-0001-4000-8000-000000000001', '966f0d0c-0855-4aa2-821d-3c023d883cd0', 'Project Planning & Design', 'Learn to design public health projects using logical frameworks, stakeholder analysis, and needs assessment tools.', 1);

-- Module 3: Implementation & Monitoring
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b1a10001-0001-4000-8000-000000000002', '966f0d0c-0855-4aa2-821d-3c023d883cd0', 'Implementation & Monitoring', 'Master project execution strategies, quality assurance, and real-time monitoring of public health interventions.', 2);

-- Module 4: Evaluation & Reporting
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b1a10001-0001-4000-8000-000000000003', '966f0d0c-0855-4aa2-821d-3c023d883cd0', 'Evaluation & Reporting', 'Conduct impact evaluations, write donor reports, and communicate project outcomes effectively.', 3);

-- Module 5: Leadership & Sustainability
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b1a10001-0001-4000-8000-000000000004', '966f0d0c-0855-4aa2-821d-3c023d883cd0', 'Leadership & Sustainability', 'Develop leadership skills, build sustainable health programs, and manage teams in resource-limited settings.', 4);

-- ========== LESSONS ==========

-- Module 1 (Introduction - 4fc99eaf) already has "Welcome" lesson. Add more:
INSERT INTO public.lessons (module_id, title, content, lesson_type, order_index, duration_minutes, is_free_preview) VALUES
  ('4fc99eaf-8897-414e-b8c2-bd00cf4539cb', 'What is Public Health Project Management?', 'Public health project management is the application of knowledge, skills, tools, and techniques to plan, execute, and evaluate health interventions. Unlike generic project management, it operates within unique constraints: limited resources, diverse stakeholders, regulatory requirements, and the urgent need to improve population health outcomes.

Key characteristics that distinguish public health PM:
- Community-centered approach requiring participatory methods
- Evidence-based decision making using epidemiological data
- Multi-sectoral collaboration across government, NGOs, and communities
- Ethical considerations including equity, justice, and do-no-harm principles
- Sustainability planning from day one

The project lifecycle in public health typically follows: Needs Assessment → Planning → Implementation → Monitoring → Evaluation → Scale-up/Close-out.', 'text', 1, 15, true),

  ('4fc99eaf-8897-414e-b8c2-bd00cf4539cb', 'The Public Health Project Lifecycle', 'Every successful public health project follows a structured lifecycle that ensures systematic planning, execution, and learning.

Phase 1: Identification & Needs Assessment
Before any project begins, you must understand the health problem. This involves epidemiological analysis, community consultations, and reviewing existing literature. Tools like SWOT analysis and problem trees help identify root causes.

Phase 2: Design & Planning
Transform findings into a structured project plan. This includes defining objectives (SMART goals), creating logical frameworks (LogFrames), developing work breakdown structures, and budgeting. Stakeholder mapping is critical here.

Phase 3: Implementation
Execute the plan while managing resources, teams, and timelines. Adaptive management allows you to respond to changing circumstances while maintaining project integrity.

Phase 4: Monitoring & Evaluation
Continuous monitoring tracks progress against indicators. Midline and endline evaluations measure impact. Both quantitative and qualitative methods provide a complete picture.

Phase 5: Close-out & Knowledge Management
Document lessons learned, transition activities to local ownership, and disseminate findings through reports and publications.', 'text', 2, 20, false),

  ('4fc99eaf-8897-414e-b8c2-bd00cf4539cb', 'Essential PM Frameworks for Health', 'Several project management frameworks are widely used in public health:

1. Logical Framework Approach (LogFrame)
The LogFrame matrix connects project goals, purposes, outputs, and activities with verifiable indicators, means of verification, and assumptions. It is the most common framework used by international health organizations and donors.

2. Results-Based Management (RBM)
RBM focuses on achieving outcomes rather than just completing activities. It emphasizes accountability and uses performance indicators to track progress toward intended results.

3. Theory of Change (ToC)
A Theory of Change maps the causal pathway from activities to long-term impact. It identifies assumptions and preconditions, making it invaluable for complex health interventions.

4. PDSA Cycle (Plan-Do-Study-Act)
Used extensively in quality improvement, PDSA enables rapid testing of changes in healthcare delivery through iterative cycles.

5. Agile for Public Health
Increasingly, Agile methodologies are being adapted for public health, especially in digital health projects and emergency response, where rapid iteration is essential.', 'text', 3, 15, false);

-- Module 2: Project Planning & Design
INSERT INTO public.lessons (module_id, title, content, lesson_type, order_index, duration_minutes, is_free_preview) VALUES
  ('b1a10001-0001-4000-8000-000000000001', 'Conducting a Health Needs Assessment', 'A needs assessment is the foundation of any public health project. It systematically identifies health gaps, priorities, and resources within a target population.

Step 1: Define the Scope
Determine the geographic area, population groups, and health topics to assess. Engage community leaders early to build trust and ensure relevance.

Step 2: Collect Data
Use mixed methods: secondary data (health records, surveys, census data) and primary data (key informant interviews, focus group discussions, community mapping). Triangulate findings for validity.

Step 3: Analyze & Prioritize
Apply prioritization frameworks such as the Hanlon Method or PEARL criteria to rank identified health needs based on size, severity, feasibility, and community concern.

Step 4: Disseminate Findings
Share results with stakeholders through community meetings, reports, and presentations. Participatory validation ensures findings resonate with the community.

Common Pitfalls:
- Overlooking marginalized populations
- Relying solely on quantitative data
- Ignoring existing community assets and strengths
- Rushing the process due to donor timelines', 'text', 0, 20, false),

  ('b1a10001-0001-4000-8000-000000000001', 'Stakeholder Analysis & Engagement', 'Stakeholders are individuals, groups, or organizations that can affect or be affected by your project. Effective engagement is critical for project success.

Identifying Stakeholders:
Use brainstorming, snowball sampling, and organizational mapping. Categories include: beneficiaries, implementing partners, funders, government agencies, community leaders, and opponents.

Stakeholder Mapping:
Plot stakeholders on a Power-Interest matrix:
- High Power, High Interest → Manage closely (key partners)
- High Power, Low Interest → Keep satisfied (government officials)
- Low Power, High Interest → Keep informed (community groups)
- Low Power, Low Interest → Monitor (general public)

Engagement Strategies:
- Inform: One-way communication (newsletters, reports)
- Consult: Seek feedback (surveys, town halls)
- Involve: Work directly with stakeholders (advisory committees)
- Collaborate: Partner in decision-making (joint planning)
- Empower: Place decision-making in stakeholder hands

Building a Stakeholder Engagement Plan:
Document each stakeholder''s role, interests, potential contributions, risks, and preferred communication channels. Review and update quarterly.', 'text', 1, 18, false),

  ('b1a10001-0001-4000-8000-000000000001', 'Building a Logical Framework (LogFrame)', 'The Logical Framework is the backbone of public health project design. It provides a structured way to present project logic and is required by most international donors.

The LogFrame Matrix:
| Level | Description | Indicators | Means of Verification | Assumptions |
|-------|-------------|------------|----------------------|-------------|
| Goal | Long-term impact | Impact indicators | National surveys | Enabling environment |
| Purpose | Project outcome | Outcome indicators | Project surveys | Stakeholder cooperation |
| Outputs | Deliverables | Output indicators | Activity reports | Resources available |
| Activities | Tasks | Process indicators | Monitoring data | Staff capacity |

Writing SMART Indicators:
- Specific: Clear about what is being measured
- Measurable: Quantifiable with a target value
- Achievable: Realistic given resources
- Relevant: Directly linked to the objective
- Time-bound: Has a defined timeframe

Example: "Increase the proportion of children under 5 fully immunized from 60% to 85% in Kwara State by December 2027."

Key Tips:
- Start with the goal and work downward
- Ensure vertical logic: if activities are done AND assumptions hold, then outputs are achieved
- Limit to 3-5 indicators per level
- Include both quantitative and qualitative indicators', 'text', 2, 25, false),

  ('b1a10001-0001-4000-8000-000000000001', 'Budgeting & Resource Planning', 'Effective budgeting ensures your project has the resources needed to achieve its objectives while maintaining financial accountability.

Budget Categories:
1. Personnel: Staff salaries, consultants, per diem
2. Travel: Field visits, conferences, monitoring trips
3. Equipment: Vehicles, IT, medical supplies
4. Activities: Training, workshops, community events
5. Operational: Office rent, utilities, communications
6. Indirect/Overhead: Usually 7-15% of direct costs

Budget Development Process:
- Cost each activity in the work plan
- Research unit costs using local market rates
- Add contingency (5-10% for unforeseen expenses)
- Align with donor budget templates and policies
- Build in sustainability costs

Common Budget Mistakes:
- Underestimating personnel costs
- Forgetting inflation adjustments for multi-year projects
- Not budgeting for M&E activities
- Ignoring exchange rate fluctuations
- Omitting community contribution (in-kind)

Cash Flow Planning:
Create quarterly disbursement schedules aligned with activity timelines. Anticipate delays in donor funding and build buffer periods.', 'text', 3, 20, false);

-- Module 3: Implementation & Monitoring
INSERT INTO public.lessons (module_id, title, content, lesson_type, order_index, duration_minutes, is_free_preview) VALUES
  ('b1a10001-0001-4000-8000-000000000002', 'Project Launch & Team Management', 'Launching a public health project requires careful coordination. The inception phase sets the tone for the entire project.

Inception Activities:
- Conduct kick-off meetings with all stakeholders
- Establish governance structures (steering committees, technical advisory groups)
- Recruit and onboard project staff
- Set up office, logistics, and financial systems
- Develop detailed implementation plans with milestones

Team Management in Public Health:
Public health teams are often diverse: clinicians, community health workers, data officers, and administrators. Effective management requires:

- Clear role definitions and terms of reference
- Regular team meetings (weekly operational, monthly strategic)
- Performance management with supportive supervision
- Capacity building and mentorship
- Conflict resolution mechanisms
- Attention to staff wellbeing and burnout prevention

Managing Community Health Workers (CHWs):
CHWs are the backbone of many public health projects. Ensure they receive adequate training, supervision, supplies, and recognition. Motivation strategies include regular feedback, peer support groups, and performance incentives.', 'text', 0, 20, false),

  ('b1a10001-0001-4000-8000-000000000002', 'Monitoring Frameworks & Tools', 'Monitoring is the continuous tracking of project activities, outputs, and early outcomes. It provides real-time data for decision-making.

Building a Monitoring Plan:
1. Define indicators (process, output, outcome)
2. Set targets and milestones
3. Identify data sources and collection methods
4. Assign responsibilities for data collection
5. Determine reporting frequency and formats

Essential Monitoring Tools:
- Activity Tracking Table: Maps activities against timelines and completion status
- Indicator Dashboard: Visual display of key performance indicators
- Supervision Checklists: Standardized tools for field visits
- Beneficiary Registers: Track individuals reached by the project
- Financial Monitoring: Budget vs. actual expenditure reports

Data Quality Assurance:
- Routine data quality assessments (RDQA)
- Data verification through spot checks
- Regular review meetings to discuss data
- Use of standardized data collection forms
- Training data collectors on accuracy and completeness

Digital Tools for Monitoring:
Platforms like DHIS2, KoboToolbox, ODK, and CommCare enable mobile data collection and real-time dashboards. Consider data security, internet connectivity, and user capacity when selecting tools.', 'text', 1, 22, false),

  ('b1a10001-0001-4000-8000-000000000002', 'Risk Management in Health Projects', 'Every public health project faces risks. Proactive risk management minimizes their impact on project objectives.

Risk Identification:
Common risks in public health projects include:
- Community resistance or low uptake of interventions
- Funding delays or budget cuts
- Staff turnover in remote areas
- Supply chain disruptions for medical commodities
- Natural disasters or disease outbreaks
- Political instability or policy changes
- Data security breaches

Risk Assessment Matrix:
Evaluate each risk on two dimensions:
- Likelihood: Very Low (1) to Very High (5)
- Impact: Negligible (1) to Severe (5)
- Risk Score = Likelihood × Impact

Risk Response Strategies:
- Avoid: Eliminate the risk by changing the approach
- Mitigate: Reduce likelihood or impact through preventive actions
- Transfer: Shift risk to another party (insurance, partnerships)
- Accept: Acknowledge and prepare contingency plans

Developing a Risk Register:
Document all identified risks with their assessment, response strategy, responsible person, and review dates. Update the register quarterly and after any significant event.', 'text', 2, 18, false),

  ('b1a10001-0001-4000-8000-000000000002', 'Adaptive Management & Problem Solving', 'Public health projects operate in complex, dynamic environments. Adaptive management enables teams to respond effectively to changing conditions.

What is Adaptive Management?
It is an intentional approach to making decisions and adjustments in response to new information and changes in context, while maintaining focus on intended outcomes.

The Adaptive Management Cycle:
1. Plan: Design with flexibility built in
2. Act: Implement activities as planned
3. Observe: Collect data and monitor progress
4. Reflect: Analyze findings in team discussions
5. Adapt: Make evidence-based adjustments
6. Document: Record changes and rationale

Tools for Adaptive Management:
- Pause and Reflect sessions: Quarterly team reflections
- After Action Reviews (AARs): Post-activity learning discussions
- Outcome Harvesting: Identify unintended outcomes
- Scenario Planning: Prepare for multiple futures
- Rapid feedback loops with beneficiaries

When to Pivot:
Signal indicators that suggest a change is needed:
- Consistently missing targets despite adequate resources
- Significant changes in the operating environment
- New evidence contradicting project assumptions
- Stakeholder feedback suggesting different priorities', 'text', 3, 15, false);

-- Module 4: Evaluation & Reporting
INSERT INTO public.lessons (module_id, title, content, lesson_type, order_index, duration_minutes, is_free_preview) VALUES
  ('b1a10001-0001-4000-8000-000000000003', 'Designing an Evaluation Plan', 'Evaluation answers the question: "Did the project make a difference?" A well-designed evaluation plan is essential for accountability and learning.

Types of Evaluation:
- Formative: During implementation to improve the project
- Summative: At the end to assess overall impact
- Process: How well was the project implemented?
- Outcome: What changes occurred in the target population?
- Impact: What long-term effects are attributable to the project?

Evaluation Design Options:
1. Experimental (RCT): Gold standard but often impractical
2. Quasi-experimental: Comparison groups without randomization
3. Pre-post: Measure before and after the intervention
4. Mixed methods: Combine quantitative and qualitative approaches
5. Participatory: Involve beneficiaries in the evaluation process

Key Components of an Evaluation Plan:
- Evaluation questions aligned with project objectives
- Methodology and sampling strategy
- Data collection instruments and timeline
- Ethical considerations and IRB approval
- Analysis plan and dissemination strategy
- Budget and human resources for the evaluation', 'text', 0, 22, false),

  ('b1a10001-0001-4000-8000-000000000003', 'Data Collection & Analysis Methods', 'Robust data collection and analysis are the foundation of credible evaluation findings.

Quantitative Methods:
- Household surveys with structured questionnaires
- Health facility assessments using checklists
- Routine health information system data extraction
- Biomarker and clinical measurements
- Mobile phone surveys for rapid assessments

Qualitative Methods:
- Key informant interviews with stakeholders
- Focus group discussions with beneficiaries
- Most Significant Change stories
- Direct observation of service delivery
- Document review of project records

Mixed Methods Integration:
- Sequential: Qualitative informs quantitative design (or vice versa)
- Concurrent: Both collected simultaneously and triangulated
- Embedded: One method nested within the other

Data Analysis:
Quantitative: Descriptive statistics, comparative analysis (chi-square, t-tests), regression modeling, difference-in-differences.

Qualitative: Thematic analysis, framework analysis, grounded theory, content analysis.

Ensure analysis addresses the evaluation questions directly and disaggregates data by sex, age, geography, and other equity dimensions.', 'text', 1, 25, false),

  ('b1a10001-0001-4000-8000-000000000003', 'Writing Effective Project Reports', 'Clear, compelling reports communicate your project''s achievements, challenges, and lessons to stakeholders and donors.

Report Types in Public Health Projects:
- Quarterly/Semi-annual progress reports
- Annual reports with financial summaries
- Evaluation reports (midterm and endline)
- Case studies and success stories
- Policy briefs for advocacy

Structure of a Progress Report:
1. Executive Summary (1 page max)
2. Background and Context
3. Progress Against Indicators (with data tables)
4. Key Activities and Achievements
5. Challenges and Mitigation Strategies
6. Lessons Learned
7. Workplan for Next Period
8. Financial Summary
9. Annexes (data tables, photos, success stories)

Writing Tips:
- Lead with results, not activities
- Use data visualizations (charts, maps, infographics)
- Include human interest stories alongside statistics
- Be honest about challenges and how you addressed them
- Align with donor reporting templates and deadlines
- Have reports reviewed by technical and communications staff

Financial Reporting:
Always reconcile financial reports with narrative progress. Show burn rate, cost per beneficiary, and variance explanations.', 'text', 2, 20, false),

  ('b1a10001-0001-4000-8000-000000000003', 'Knowledge Management & Dissemination', 'Knowledge management ensures that lessons from your project are captured, shared, and used to improve future interventions.

What to Document:
- What worked and why (best practices)
- What didn''t work and why (lessons learned)
- Innovations and adaptations
- Community perspectives and feedback
- Unintended consequences (positive and negative)

Dissemination Channels:
- Peer-reviewed journal publications
- Conference presentations and posters
- Policy briefs for government audiences
- Community feedback meetings
- Social media and organizational websites
- Webinars and learning events

Building a Learning Culture:
- Schedule regular reflection sessions
- Create a shared knowledge repository
- Encourage documentation at all levels
- Reward knowledge sharing behaviors
- Connect with communities of practice

Research-to-Practice Gap:
Many valuable findings never reach practitioners. Bridge this gap by:
- Translating findings into actionable recommendations
- Engaging end-users in the dissemination process
- Creating practical toolkits and guides
- Partnering with implementing organizations', 'text', 3, 18, false);

-- Module 5: Leadership & Sustainability
INSERT INTO public.lessons (module_id, title, content, lesson_type, order_index, duration_minutes, is_free_preview) VALUES
  ('b1a10001-0001-4000-8000-000000000004', 'Leadership in Public Health', 'Effective public health project management requires more than technical skills—it demands leadership that inspires, mobilizes, and sustains change.

Leadership Competencies:
- Vision: Articulate a compelling picture of improved health outcomes
- Emotional Intelligence: Understand and manage your own emotions and those of your team
- Communication: Convey complex health information clearly to diverse audiences
- Decision-Making: Make timely decisions with incomplete information
- Cultural Sensitivity: Navigate diverse cultural contexts respectfully
- Advocacy: Champion health priorities at policy and community levels

Leadership Styles for Public Health:
- Servant Leadership: Prioritize team and community needs
- Transformational: Inspire and motivate toward a shared vision
- Adaptive: Flex style based on context and team maturity
- Distributed: Share leadership across team members and community partners

Leading in Resource-Limited Settings:
- Prioritize ruthlessly—focus on highest-impact activities
- Build coalitions to multiply resources
- Invest in local capacity for long-term sustainability
- Practice self-care to avoid burnout
- Celebrate small wins to maintain team morale', 'text', 0, 18, false),

  ('b1a10001-0001-4000-8000-000000000004', 'Building Sustainable Health Programs', 'Sustainability means ensuring that project benefits continue after external funding ends. It should be planned from the start, not as an afterthought.

Dimensions of Sustainability:
1. Financial: Diversified funding, government budget integration, revenue generation
2. Institutional: Strong local organizations, governance structures, policies
3. Technical: Local capacity to maintain and adapt interventions
4. Social: Community ownership, demand, and participation
5. Environmental: Interventions that don''t harm natural resources

Sustainability Planning Framework:
- Assess sustainability at project design stage
- Identify sustainability risks and mitigation strategies
- Build local capacity through training and mentorship
- Engage government from the start for policy integration
- Develop transition plans at least 12 months before project end
- Monitor sustainability indicators throughout implementation

Exit Strategies:
- Phase-over: Transfer to government or local NGO
- Phase-down: Gradually reduce external support
- Phase-out: Complete withdrawal with handover
- Scale-up: Expand successful models through policy adoption

Community Ownership:
True sustainability requires communities to view the intervention as their own. Participatory design, local governance structures, and community co-financing all strengthen ownership.', 'text', 1, 22, false),

  ('b1a10001-0001-4000-8000-000000000004', 'Ethics & Governance in Health Projects', 'Ethical practice is non-negotiable in public health project management. Projects must protect participants, promote equity, and maintain accountability.

Core Ethical Principles:
- Respect for Persons: Informed consent, confidentiality, autonomy
- Beneficence: Maximize benefits, minimize harm
- Justice: Fair distribution of benefits and burdens
- Non-maleficence: Do no harm to participants or communities

Governance Structures:
- Project Steering Committee: Provides strategic oversight
- Technical Advisory Group: Offers technical guidance
- Community Advisory Board: Ensures community voice
- Ethics Review Board: Reviews research components

Data Ethics:
- Protect participant privacy and data security
- Obtain proper consent for data collection
- Ensure data is used only for stated purposes
- Share findings with participants and communities
- Follow local and international data protection regulations

Accountability Mechanisms:
- Financial audits (internal and external)
- Beneficiary feedback mechanisms
- Whistleblower policies
- Regular reporting to stakeholders
- Compliance with donor and government regulations', 'text', 2, 15, false),

  ('b1a10001-0001-4000-8000-000000000004', 'Capstone: Your Project Management Plan', 'In this final lesson, you will synthesize everything you have learned to create a comprehensive project management plan for a public health intervention of your choice.

Your Plan Should Include:

1. Situation Analysis (2 pages)
- Describe the health problem using epidemiological data
- Identify the target population and geographic area
- Summarize findings from a needs assessment

2. Project Design (3 pages)
- State the goal, purpose, and objectives (SMART)
- Present a Logical Framework (LogFrame)
- Include a Theory of Change diagram
- Describe key strategies and activities

3. Implementation Plan (2 pages)
- Work breakdown structure with timeline (Gantt chart)
- Team structure and roles
- Stakeholder engagement plan
- Risk register with mitigation strategies

4. Monitoring & Evaluation Plan (2 pages)
- M&E framework with indicators
- Data collection methods and tools
- Evaluation design and timeline

5. Budget & Sustainability (2 pages)
- Detailed budget by category
- Sustainability plan with exit strategy

6. Ethics & Governance (1 page)
- Ethical considerations
- Governance structure

Submit your plan for peer review and facilitator feedback. This capstone project serves as your portfolio piece for demonstrating project management competency.', 'text', 3, 30, false);

-- ========== ASSESSMENTS ==========

-- Assessment for Module 1 (Introduction)
INSERT INTO public.assessments (id, module_id, title, description, pass_percentage, is_required, time_limit_minutes) VALUES
  ('a1a10001-0001-4000-8000-000000000001', '4fc99eaf-8897-414e-b8c2-bd00cf4539cb', 'Introduction to Public Health PM', 'Test your understanding of project management foundations in public health.', 70, true, 15);

INSERT INTO public.assessment_questions (assessment_id, question_text, question_type, options, correct_answer, points, order_index) VALUES
  ('a1a10001-0001-4000-8000-000000000001', 'Which framework uses a matrix connecting goals, purposes, outputs, and activities with indicators?', 'multiple_choice', '["Logical Framework (LogFrame)", "PDSA Cycle", "Agile Methodology", "SWOT Analysis"]', 'Logical Framework (LogFrame)', 1, 0),
  ('a1a10001-0001-4000-8000-000000000001', 'What is the correct order of the public health project lifecycle?', 'multiple_choice', '["Planning → Implementation → Needs Assessment → Evaluation", "Needs Assessment → Planning → Implementation → Monitoring → Evaluation", "Implementation → Monitoring → Planning → Close-out", "Evaluation → Planning → Implementation → Monitoring"]', 'Needs Assessment → Planning → Implementation → Monitoring → Evaluation', 1, 1),
  ('a1a10001-0001-4000-8000-000000000001', 'Which principle distinguishes public health PM from generic project management?', 'multiple_choice', '["Profit maximization", "Community-centered approach", "Individual patient care", "Shareholder returns"]', 'Community-centered approach', 1, 2),
  ('a1a10001-0001-4000-8000-000000000001', 'A Theory of Change maps what?', 'multiple_choice', '["Budget allocations", "Staff hierarchy", "Causal pathway from activities to impact", "Geographic project locations"]', 'Causal pathway from activities to impact', 1, 3),
  ('a1a10001-0001-4000-8000-000000000001', 'The PDSA cycle stands for:', 'multiple_choice', '["Plan-Do-Study-Act", "Prepare-Deploy-Sustain-Assess", "Plan-Design-Scale-Approve", "Predict-Deliver-Support-Adapt"]', 'Plan-Do-Study-Act', 1, 4);

-- Assessment for Module 2 (Planning & Design)
INSERT INTO public.assessments (id, module_id, title, description, pass_percentage, is_required, time_limit_minutes) VALUES
  ('a1a10001-0001-4000-8000-000000000002', 'b1a10001-0001-4000-8000-000000000001', 'Project Planning & Design Assessment', 'Evaluate your knowledge of needs assessment, stakeholder analysis, LogFrames, and budgeting.', 70, true, 20);

INSERT INTO public.assessment_questions (assessment_id, question_text, question_type, options, correct_answer, points, order_index) VALUES
  ('a1a10001-0001-4000-8000-000000000002', 'In a stakeholder Power-Interest matrix, how should you manage a stakeholder with High Power and High Interest?', 'multiple_choice', '["Monitor only", "Keep satisfied", "Keep informed", "Manage closely"]', 'Manage closely', 1, 0),
  ('a1a10001-0001-4000-8000-000000000002', 'What does the "M" in SMART indicators stand for?', 'multiple_choice', '["Meaningful", "Measurable", "Manageable", "Modifiable"]', 'Measurable', 1, 1),
  ('a1a10001-0001-4000-8000-000000000002', 'Which prioritization method is commonly used in health needs assessments?', 'multiple_choice', '["PERT analysis", "Hanlon Method", "Monte Carlo simulation", "Kanban"]', 'Hanlon Method', 1, 2),
  ('a1a10001-0001-4000-8000-000000000002', 'What is the typical range for indirect/overhead costs in project budgets?', 'multiple_choice', '["1-3%", "7-15%", "25-30%", "50%+"]', '7-15%', 1, 3),
  ('a1a10001-0001-4000-8000-000000000002', 'The vertical logic in a LogFrame means:', 'multiple_choice', '["Budget flows from top to bottom", "If activities are done AND assumptions hold, outputs are achieved", "All indicators must be quantitative", "Activities are listed chronologically"]', 'If activities are done AND assumptions hold, outputs are achieved', 1, 4);

-- Assessment for Module 3 (Implementation & Monitoring)
INSERT INTO public.assessments (id, module_id, title, description, pass_percentage, is_required, time_limit_minutes) VALUES
  ('a1a10001-0001-4000-8000-000000000003', 'b1a10001-0001-4000-8000-000000000002', 'Implementation & Monitoring Assessment', 'Test your knowledge of project execution, monitoring, risk management, and adaptive management.', 70, true, 20);

INSERT INTO public.assessment_questions (assessment_id, question_text, question_type, options, correct_answer, points, order_index) VALUES
  ('a1a10001-0001-4000-8000-000000000003', 'Which digital tool is widely used for routine health data management in developing countries?', 'multiple_choice', '["Microsoft Excel only", "DHIS2", "Instagram", "ChatGPT"]', 'DHIS2', 1, 0),
  ('a1a10001-0001-4000-8000-000000000003', 'In risk management, the Risk Score is calculated as:', 'multiple_choice', '["Likelihood + Impact", "Likelihood × Impact", "Impact ÷ Likelihood", "Likelihood - Impact"]', 'Likelihood × Impact', 1, 1),
  ('a1a10001-0001-4000-8000-000000000003', 'What is the purpose of an After Action Review (AAR)?', 'multiple_choice', '["Financial auditing", "Post-activity learning discussion", "Staff performance evaluation", "Donor reporting"]', 'Post-activity learning discussion', 1, 2),
  ('a1a10001-0001-4000-8000-000000000003', 'RDQA stands for:', 'multiple_choice', '["Rapid Data Quality Assessment", "Regional Data Quantification Analysis", "Research Design Quality Audit", "Remote Data Query Application"]', 'Rapid Data Quality Assessment', 1, 3),
  ('a1a10001-0001-4000-8000-000000000003', 'Which risk response strategy involves shifting risk to another party?', 'multiple_choice', '["Avoid", "Mitigate", "Transfer", "Accept"]', 'Transfer', 1, 4);

-- Assessment for Module 4 (Evaluation & Reporting)
INSERT INTO public.assessments (id, module_id, title, description, pass_percentage, is_required, time_limit_minutes) VALUES
  ('a1a10001-0001-4000-8000-000000000004', 'b1a10001-0001-4000-8000-000000000003', 'Evaluation & Reporting Assessment', 'Assess your understanding of evaluation design, data methods, reporting, and knowledge management.', 70, true, 20);

INSERT INTO public.assessment_questions (assessment_id, question_text, question_type, options, correct_answer, points, order_index) VALUES
  ('a1a10001-0001-4000-8000-000000000004', 'Which evaluation type is considered the "gold standard"?', 'multiple_choice', '["Pre-post design", "Participatory evaluation", "Randomized Controlled Trial (RCT)", "Case study"]', 'Randomized Controlled Trial (RCT)', 1, 0),
  ('a1a10001-0001-4000-8000-000000000004', 'What is the recommended maximum length for an Executive Summary?', 'multiple_choice', '["5 pages", "1 page", "10 pages", "Half page"]', '1 page', 1, 1),
  ('a1a10001-0001-4000-8000-000000000004', 'Most Significant Change is a method used in:', 'multiple_choice', '["Financial auditing", "Qualitative data collection", "Budget planning", "Staff recruitment"]', 'Qualitative data collection', 1, 2),
  ('a1a10001-0001-4000-8000-000000000004', 'When should a progress report lead with?', 'multiple_choice', '["Activities completed", "Results achieved", "Challenges faced", "Budget expenditure"]', 'Results achieved', 1, 3),
  ('a1a10001-0001-4000-8000-000000000004', 'Difference-in-differences is a type of:', 'multiple_choice', '["Qualitative analysis", "Budget analysis", "Quantitative comparative analysis", "Stakeholder mapping"]', 'Quantitative comparative analysis', 1, 4);

-- Assessment for Module 5 (Leadership & Sustainability)
INSERT INTO public.assessments (id, module_id, title, description, pass_percentage, is_required, time_limit_minutes) VALUES
  ('a1a10001-0001-4000-8000-000000000005', 'b1a10001-0001-4000-8000-000000000004', 'Leadership & Sustainability Assessment', 'Final assessment covering leadership, sustainability, ethics, and governance in public health projects.', 70, true, 20);

INSERT INTO public.assessment_questions (assessment_id, question_text, question_type, options, correct_answer, points, order_index) VALUES
  ('a1a10001-0001-4000-8000-000000000005', 'Which leadership style prioritizes team and community needs above the leader''s own?', 'multiple_choice', '["Autocratic", "Servant Leadership", "Transactional", "Laissez-faire"]', 'Servant Leadership', 1, 0),
  ('a1a10001-0001-4000-8000-000000000005', 'A phase-over exit strategy means:', 'multiple_choice', '["Complete project withdrawal", "Transfer to government or local NGO", "Gradual reduction of support", "Expanding to new areas"]', 'Transfer to government or local NGO', 1, 1),
  ('a1a10001-0001-4000-8000-000000000005', 'Which is NOT a dimension of sustainability?', 'multiple_choice', '["Financial", "Institutional", "Profitability", "Technical"]', 'Profitability', 1, 2),
  ('a1a10001-0001-4000-8000-000000000005', 'The principle of "beneficence" in ethics means:', 'multiple_choice', '["Maximize profits", "Maximize benefits and minimize harm", "Follow government regulations", "Maintain confidentiality"]', 'Maximize benefits and minimize harm', 1, 3),
  ('a1a10001-0001-4000-8000-000000000005', 'When should sustainability planning ideally begin?', 'multiple_choice', '["At project close-out", "During the last year", "At project design stage", "After the final evaluation"]', 'At project design stage', 1, 4);
