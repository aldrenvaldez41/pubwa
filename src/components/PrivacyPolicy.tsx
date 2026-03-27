import { Shield, Lock, Eye, Users, Mail, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
              <p className="text-slate-300 mt-2">Last Updated: January 21, 2026</p>
            </div>
          </div>
          <p className="text-xl text-slate-300">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 space-y-12">
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                Build with Aldren ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p className="text-slate-700 leading-relaxed">
                This policy applies to all information collected through our website, services, and any related communications. By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">2. Information We Collect</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">2.1 Personal Information</h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Contact us through our contact form
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Place an order for our services
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Subscribe to our newsletter or updates
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Interact with our website or services
                    </li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed mt-3">
                    Personal information may include: Full name, Email address, Phone number, Billing information, Payment method preferences, and Project requirements or specifications.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">2.2 Automatically Collected Information</h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    When you visit our website, we may automatically collect certain information about your device and browsing behavior, including:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      IP address and browser type
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Operating system and device information
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Pages visited and time spent on pages
                    </li>
                    <li className="flex items-start text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      Referral sources and exit pages
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">2.3 Payment Information</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Payment information is processed securely through third-party payment processors (PayMongo, Xendit, PayPal). We do not store complete credit card or banking information on our servers. We may retain transaction IDs and payment status for record-keeping purposes.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">3. How We Use Your Information</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  To provide and maintain our services
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  To process your orders and payments
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  To communicate with you about your projects or inquiries
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  To send order confirmations, receipts, and important updates
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  To improve our website and services
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  To respond to customer service requests and support needs
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  To send marketing communications (with your consent)
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  To comply with legal obligations and protect our rights
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">4. Third-Party Services</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use trusted third-party services to provide and improve our services:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Supabase</h4>
                  <p className="text-slate-700 text-sm">Database and backend infrastructure for storing orders, messages, and application data.</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">PayMongo, Xendit & PayPal</h4>
                  <p className="text-slate-700 text-sm">Secure payment processing services for handling transactions. These services have their own privacy policies and security measures.</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Brevo (formerly Sendinblue)</h4>
                  <p className="text-slate-700 text-sm">Email service for sending transactional emails, receipts, and communications.</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed mt-4">
                These third parties have access to your information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose. We recommend reviewing their respective privacy policies.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">5. Data Security</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  SSL/TLS encryption for data transmission
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Secure database storage with access controls
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Regular security audits and updates
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  Limited access to personal information by authorized personnel only
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">6. Data Retention</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Order and transaction information is typically retained for accounting and legal compliance purposes for a period of up to 7 years. Contact form submissions are retained for 2 years unless you request earlier deletion.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">7. Your Data Rights</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                Under the Philippine Data Privacy Act of 2012 and GDPR (for EU residents), you have the following rights:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span><strong>Right to Access:</strong> Request copies of your personal data</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span><strong>Right to Rectification:</strong> Request correction of inaccurate data</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span><strong>Right to Erasure:</strong> Request deletion of your personal data</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span><strong>Right to Restrict Processing:</strong> Request limitation of data processing</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span><strong>Right to Data Portability:</strong> Receive your data in a structured format</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span><strong>Right to Object:</strong> Object to processing of your data</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</span>
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                To exercise any of these rights, please contact us using the information provided in the Contact section below.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">8. Cookies and Tracking</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device. We use:
              </p>
              <ul className="space-y-2 ml-6 mb-4">
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span><strong>Essential Cookies:</strong> Required for website functionality</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span><strong>Session Cookies:</strong> Temporary storage for cart and payment processing</span>
                </li>
                <li className="flex items-start text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                  <span><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</span>
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                You can control cookies through your browser settings. However, disabling cookies may affect website functionality.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">9. Children's Privacy</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take steps to delete such information.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">10. International Data Transfers</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Your information may be transferred to and maintained on servers located outside of the Philippines. By using our services, you consent to the transfer of your information to countries that may have different data protection laws. We ensure appropriate safeguards are in place to protect your information.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">11. Changes to This Policy</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new policy on this page with an updated "Last Updated" date. Your continued use of our services after any changes indicates your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">12. Contact Us</h2>
              </div>
              <p className="text-slate-700 leading-relaxed mb-6">
                If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us:
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
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Regulatory Compliance</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  This Privacy Policy complies with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173) and incorporates principles from the General Data Protection Regulation (GDPR) to ensure the highest standards of data protection for all users.
                </p>
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
