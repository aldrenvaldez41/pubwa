import { Scale, AlertTriangle, FileText, Shield, Ban, UserCheck } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Scale className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold">Terms of Service</h1>
              <p className="text-slate-300 mt-2">Effective Date: January 21, 2026</p>
            </div>
          </div>
          <p className="text-xl text-slate-300">
            Please read these terms carefully before using our services. By accessing or using our services, you agree to be bound by these terms.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 space-y-12">
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">1. Agreement to Terms</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client", "you", or "your") and Build with Aldren ("we", "us", or "our") regarding your use of our website and services.
              </p>
              <p className="text-slate-700 leading-relaxed">
                By accessing our website at buildwithaldren.com or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our services.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <UserCheck className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">2. Services Description</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                Build with Aldren provides professional web development and technology services, including but not limited to:
              </p>
              <ul className="space-y-2 ml-6 mb-4">
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Website design and development
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Custom web application development
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  AI integration and automation solutions
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Mobile-responsive design implementation
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Security and performance optimization
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Technical consultation and support
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Services are provided on a project basis or through ongoing support agreements as mutually agreed upon. Specific deliverables, timelines, and pricing will be outlined in separate project proposals or service agreements.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">3. Eligibility and Account</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 Eligibility</h3>
                  <p className="text-slate-700 leading-relaxed">
                    You must be at least 18 years old or the age of majority in your jurisdiction to use our services. By using our services, you represent and warrant that you meet these requirements and have the legal capacity to enter into these Terms.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Account Responsibilities</h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    When engaging our services, you agree to:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Provide accurate and complete information
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Maintain the confidentiality of any login credentials
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Notify us immediately of any unauthorized use
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Be responsible for all activities under your account
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">4. Payment Terms</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">4.1 Pricing and Fees</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Service fees are specified in project proposals or service agreements. All prices are quoted in Philippine Pesos (PHP) unless otherwise stated. Prices may be subject to change with prior notice.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">4.2 Payment Methods</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We accept payments through PayMongo (credit/debit cards, GCash, GrabPay, Maya), Xendit (e-wallets), and PayPal. All payments are processed securely through these third-party payment processors.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">4.3 Payment Schedule</h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Payment terms are typically structured as follows:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Initial deposit (usually 50%) upon project commencement
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Milestone payments as specified in project agreement
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Final payment upon project completion and approval
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">4.4 Refund Policy</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Deposits are generally non-refundable once work has commenced. Refund requests will be evaluated on a case-by-case basis. Any approved refunds will be issued through the original payment method within 14-30 business days.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">4.5 Late Payments</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Late payments may result in project suspension or termination. We reserve the right to charge interest on overdue amounts at a rate of 2% per month or the maximum rate permitted by law, whichever is lower.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">5. Intellectual Property Rights</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 Client Content</h3>
                  <p className="text-slate-700 leading-relaxed">
                    You retain all ownership rights to any content, materials, information, or data you provide to us ("Client Content"). By providing Client Content, you grant us a limited, non-exclusive license to use, reproduce, and modify such content solely for the purpose of providing services to you.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">5.2 Deliverables</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Upon receipt of full payment, you will own all rights to the final deliverables created specifically for your project, excluding any pre-existing materials, third-party components, or our proprietary tools and frameworks.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">5.3 Our Property</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We retain ownership of all proprietary methodologies, tools, frameworks, templates, and general knowledge developed independently or used in providing services. This includes any reusable code libraries, development tools, or documentation templates.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">5.4 Portfolio Rights</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Unless otherwise agreed in writing, we reserve the right to showcase completed projects in our portfolio, case studies, and marketing materials. We will seek your permission before disclosing confidential or sensitive information.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Ban className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">6. Prohibited Activities</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Violating any applicable laws or regulations
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Infringing on intellectual property rights of others
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Using services for illegal, fraudulent, or malicious purposes
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Attempting to gain unauthorized access to our systems
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Distributing malware, viruses, or harmful code
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Harassing, threatening, or harming others
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Reverse engineering or copying our proprietary technology
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Requesting services that violate ethical standards or laws
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">7. Service Availability and Modifications</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">7.1 Availability</h3>
                  <p className="text-slate-700 leading-relaxed">
                    While we strive to provide reliable services, we do not guarantee uninterrupted access to our website or services. We may temporarily suspend access for maintenance, updates, or unforeseen circumstances without prior notice.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">7.2 Modifications</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We reserve the right to modify, suspend, or discontinue any aspect of our services at any time. We will provide reasonable notice of material changes when practicable.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">8. Disclaimers and Warranties</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">8.1 Service Warranty</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We warrant that services will be performed in a professional and workmanlike manner consistent with industry standards. However, we do not guarantee specific results or outcomes.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">8.2 Disclaimer of Warranties</h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    EXCEPT AS EXPRESSLY PROVIDED, OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Warranties of merchantability or fitness for a particular purpose
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Warranties regarding accuracy, reliability, or completeness
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Warranties that services will meet your specific requirements
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Warranties regarding compatibility with third-party services
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">8.3 Third-Party Services</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Our services may integrate with third-party platforms and services. We are not responsible for the availability, functionality, or security of third-party services beyond our control.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">9. Limitation of Liability</h2>
              </div>
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, BUILD WITH ALDREN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    Loss of profits, revenue, or business opportunities
                  </li>
                  <li className="flex items-start text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    Loss of data or information
                  </li>
                  <li className="flex items-start text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    Business interruption or downtime
                  </li>
                  <li className="flex items-start text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    Costs of procurement of substitute services
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed mt-4">
                  OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR OUR SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR PHP 50,000, WHICHEVER IS LESS.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <UserCheck className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">10. Indemnification</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Build with Aldren, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to: (a) your use of our services; (b) your violation of these Terms; (c) your violation of any rights of another party; or (d) any Client Content you provide.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Ban className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">11. Termination</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">11.1 Termination by Client</h3>
                  <p className="text-slate-700 leading-relaxed">
                    You may terminate a project or service agreement by providing written notice. You will be responsible for payment of all work completed up to the termination date, plus any non-refundable deposits.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">11.2 Termination by Us</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We may terminate or suspend your access to services immediately, without prior notice, if you breach these Terms, engage in prohibited activities, or fail to make required payments.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">11.3 Effects of Termination</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Upon termination, your right to use our services ceases immediately. Provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">12. Dispute Resolution</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">12.1 Informal Resolution</h3>
                  <p className="text-slate-700 leading-relaxed">
                    In the event of any dispute, claim, or controversy, you agree to first contact us to attempt to resolve the issue informally by discussing it directly with us.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">12.2 Mediation</h3>
                  <p className="text-slate-700 leading-relaxed">
                    If informal resolution is unsuccessful, parties agree to attempt mediation before pursuing formal legal proceedings.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">12.3 Governing Law and Jurisdiction</h3>
                  <p className="text-slate-700 leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to conflict of law principles. Any legal action or proceeding arising under these Terms shall be brought exclusively in the courts located in the Philippines, and you consent to the personal jurisdiction of such courts.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">13. General Provisions</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">13.1 Entire Agreement</h3>
                  <p className="text-slate-700 leading-relaxed">
                    These Terms, together with any project proposals or service agreements, constitute the entire agreement between you and Build with Aldren regarding the use of our services.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">13.2 Amendments</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We reserve the right to modify these Terms at any time. We will provide notice of material changes by updating the "Effective Date" and posting the revised Terms on our website. Your continued use of our services after changes become effective constitutes acceptance of the modified Terms.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">13.3 Severability</h3>
                  <p className="text-slate-700 leading-relaxed">
                    If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">13.4 Waiver</h3>
                  <p className="text-slate-700 leading-relaxed">
                    No waiver of any term or condition shall be deemed a further or continuing waiver of such term or any other term. Our failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">13.5 Assignment</h3>
                  <p className="text-slate-700 leading-relaxed">
                    You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">13.6 Force Majeure</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">14. Contact Information</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                <p className="font-semibold text-slate-900 mb-3">Build with Aldren</p>
                <div className="space-y-2">
                  <p className="text-slate-700">
                    <strong>Email:</strong> <a href="mailto:support@buildwithaldren.com" className="text-blue-600 hover:text-blue-700">support@buildwithaldren.com</a>
                  </p>
                  <p className="text-slate-700">
                    <strong>Phone:</strong> <a href="tel:+639161171825" className="text-blue-600 hover:text-blue-700">09161171825</a>
                  </p>
                  <p className="text-slate-700">
                    <strong>Location:</strong> Philippines
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Acknowledgment</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT USE OUR SERVICES.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
