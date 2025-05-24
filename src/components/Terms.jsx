import AppModal from "./AppModal";

const Terms = ({ title, isOpen, onClose }) => {
  return (
    <AppModal
      title={"Terms and Conditions"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <article className="prose prose-sm max-w-none text-gray-700">
        <div className="space-y-6">
          <div>
            <p className="font-medium text-base text-gray-900 mb-4">
              UTLAM Mobile Application terms and conditions (Terms) brought to
              you by The UTL Asset Management Limited.
            </p>
          </div>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">
              1. Introduction
            </h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                You will only have access to the App if you have been duly
                authorised to act as a User on behalf of a Customer that has
                signed the Mobile App Terms and Conditions with UTL Asset
                Management Limited relevant jurisdiction, as updated from time
                to time.
              </p>
              <p>
                By using this App, you agree to be bound by these Terms. You
                acknowledge that this agreement is entered into by and between
                you and UTL Asset Management Limited.
              </p>
              <p>
                Use of the App is considered acceptance of these Terms. Do not
                use the App if You do not accept these Terms.
              </p>
              <p>
                You agree that you will only use the App in line with these
                Terms and any additional terms mentioned below that may apply,
                including any terms and conditions incorporated in these Terms
                by reference and applicable laws, rules and regulations in the
                relevant jurisdiction.
              </p>
              <p className="font-medium italic">
                Important clauses, which may limit our responsibility or involve
                some risk for you, will be in bold and italics or highlighted.
                You must pay special attention to these clauses.
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">2. Definitions</h3>
            <p className="text-sm mb-3">
              We have defined some words for consistency. These words will begin
              with a capital letter, where indicated. Singular words include the
              plural and the other way around.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-3 py-2 text-left font-medium">
                      Word
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-medium">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      Access Codes:
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      Any type of unique identifier used to enable a person to
                      identify themselves and gain authorised access to the
                      Services, including any password, operator identification
                      codes, two factor authentication codes and alternative
                      security methods.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      App:
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      UTL Asset Management Limited's mobile application,
                      downloaded onto your Device from your App Store, for which
                      channel you have registered, to access the Mobile App
                      System.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      App Store:
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      Your Device's application store provided by Apple or
                      Android, as is applicable to you, from which you download
                      the App.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      Asset Management:
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      The UTL Asset Management Limited entity with which the
                      Customer has agreed to the Mobile App Terms and
                      Conditions.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      Customer:
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      A customer of the Company.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      Device:
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      The device you use to access the App such as a cell phone,
                      smartphone and / or tablet or any similar technology.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      ISP:
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      An Internet service provider, which is an organisation
                      that provides access to the Internet.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      Operational Guide:
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      The document which sets out the procedures and regulations
                      that apply in respect of the Services, which procedures
                      and regulations are accessible through the Mobile App
                      System, and which document is incorporated herein by
                      reference.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      Personal Information:
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      Personal Information as defined by the applicable data
                      protection laws including the Nigeria Data Protection Act
                      2023 (NDPA)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      Transaction:
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      Any debit or credit on the UTLAM Account following your
                      instruction and actioned by UTLAM or the use of any UTLAM
                      facilities available on this App. Transact has a similar
                      meaning. Transactions are subject to their respective
                      product terms and condition.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">
              3. Access to the App
            </h3>
            <p className="text-sm">
              You can have only one App on a Device at a time, but you can
              download the App onto as many Devices as you require.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">
              4. Use of the App
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">4.1</span> You should only use the
                latest version of the App. The App Store will notify you of any
                updates / upgrades that are available to you. If you do not
                install the latest version, the App may not function correctly
                and you may experience security and / or data flaws, for which
                we will not be liable under any circumstances.
              </p>
              <p>
                <span className="font-medium">4.2</span> You should only use the
                App on a Device for which it is intended, and as allowed by the
                usage rules set out in your App Store's terms of service.
              </p>
              <p>
                <span className="font-medium">4.3</span> You can only Transact
                in line with the company facilities available to you through the
                Customer's Profile. You will not be afforded any additional
                permissions that have not been otherwise granted on the Profile.
              </p>
              <p>
                <span className="font-medium">4.4</span> The App allows you to
                open only one Profile at a time; meaning you can only Transact
                with the Profile you have open at any given time.
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-2">
              5. Fees and costs
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">5.1</span> There is no fee to use
                the App. You will continue to be charged Transaction fees as per
                your existing pricing agreement.
              </p>
              <p>
                <span className="font-medium">5.2</span> UTLAM mobile network
                operator data costs will be charged when you download the App,
                use the App, and thereafter receive notifications.
              </p>
            </div>
          </section>

          <div className="text-xs text-gray-500 mt-8 pt-4 border-t">
            <p>
              For complete terms and conditions, please visit:{" "}
              <a
                href="https://utlam.com"
                target="_blank"
                className="text-primary underline"
              >
                www.utlam.com
              </a>
            </p>
          </div>
        </div>
      </article>
    </AppModal>
  );
};

export default Terms;
