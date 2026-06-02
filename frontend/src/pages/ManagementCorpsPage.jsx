import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './ManagementCorpsPage.css';

const PageHeroFallback = ({ title, subtitle }) => (
  <div className="page-hero">
    <div className="container">
      <div className="breadcrumb">
        <a href="/">Home</a> <span>/</span> <span>{title}</span>
      </div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  </div>
);

const ACCORDION_SECTIONS = [
  {
    id: 'setup',
    title: 'How to Setup a Management Corporation (MC)',
    content: (
      <div className="mc-content">
        <p>
          A Management Corporation (MC) is a legal entity formed by the unit owners of a
          condominium property. It is responsible for managing the common property and ensuring the
          smooth operation of the condominium.
        </p>
        <h4>Steps to Establish a Management Corporation:</h4>
        <ol>
          <li>
            <strong>Condominium Plan Registration:</strong> Ensure the condominium plan is
            registered with the CMA under the Condominium Property Act No. 12 of 1973.
          </li>
          <li>
            <strong>Convene the First Annual General Meeting (AGM):</strong> The developer must
            convene the first AGM once all or a majority of units are sold or 12 months after the
            first sale, whichever is earlier.
          </li>
          <li>
            <strong>Elect Management Council:</strong> Unit owners elect members to the Management
            Council at the AGM. The council must have a minimum of 3 and maximum of 7 members.
          </li>
          <li>
            <strong>Adopt By-Laws &amp; Constitution:</strong> The MC must adopt its by-laws
            governing the management of common property, maintenance contributions, and conduct of
            unit owners.
          </li>
          <li>
            <strong>Register with CMA:</strong> Submit the registration application to CMA within
            30 days of the first AGM, along with the prescribed fee and required documentation.
          </li>
          <li>
            <strong>Open a Bank Account:</strong> The MC must open a dedicated bank account in its
            registered name for all financial transactions.
          </li>
        </ol>
        <p>
          Once registered, the MC obtains a unique registration number and is legally empowered to
          manage the condominium property.
        </p>
      </div>
    ),
  },
  {
    id: 'structure',
    title: 'MC Structure & Appointed Members',
    content: (
      <div className="mc-content">
        <p>
          The Management Corporation is governed by an elected Management Council comprising unit
          owners of the condominium property.
        </p>
        <h4>Key Positions:</h4>
        <ul>
          <li>
            <strong>Chairperson:</strong> Presides over meetings, represents the MC in legal
            proceedings, and provides leadership to the Management Council.
          </li>
          <li>
            <strong>Secretary:</strong> Maintains minutes of meetings, handles correspondence,
            manages records, and convenes meetings as required.
          </li>
          <li>
            <strong>Treasurer:</strong> Manages the financial affairs of the MC, maintains accounts,
            prepares financial statements, and oversees the sinking fund.
          </li>
          <li>
            <strong>Council Members (3–4):</strong> Assist in the management of common property,
            attend meetings, and participate in decision-making.
          </li>
        </ul>
        <h4>Professional Staff (where applicable):</h4>
        <ul>
          <li>Property Manager</li>
          <li>Building Superintendent / Caretaker</li>
          <li>Security Personnel</li>
          <li>Cleaning &amp; Maintenance Staff</li>
        </ul>
        <p>
          The Management Council meets at least once every three months. Unit owners may attend
          council meetings but may not vote unless they are elected members.
        </p>
      </div>
    ),
  },
  {
    id: 'responsibility',
    title: 'Responsibility of the Management Corporation',
    content: (
      <div className="mc-content">
        <p>The MC has a broad set of statutory responsibilities under the Condominium Property Act:</p>
        <ul>
          <li>Manage, maintain, and repair common property including lifts, corridors, lobbies, and recreational facilities.</li>
          <li>Effect adequate insurance on the buildings and common property.</li>
          <li>Collect maintenance contributions (levies) from unit owners.</li>
          <li>Maintain a sinking fund for major repairs and capital expenditure.</li>
          <li>Prepare and maintain proper financial accounts, subject to annual audit.</li>
          <li>Convene Annual General Meetings (AGMs) as required by law.</li>
          <li>Enforce the by-laws and rules of the condominium.</li>
          <li>Comply with all applicable laws, including fire safety and building regulations.</li>
          <li>Handle disputes between unit owners in accordance with the by-laws.</li>
          <li>Submit annual returns and reports to the CMA.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'powers',
    title: 'Powers of the Management Corporation',
    content: (
      <div className="mc-content">
        <p>The MC is vested with significant powers to carry out its responsibilities effectively:</p>
        <ul>
          <li>Sue and be sued in its corporate name.</li>
          <li>Enter into contracts for the supply of goods and services.</li>
          <li>Levy and collect maintenance contributions and special levies from unit owners.</li>
          <li>Recover unpaid levies through legal proceedings, including obtaining a lien on the defaulting unit.</li>
          <li>Set and amend by-laws subject to approval at a General Meeting.</li>
          <li>Appoint and dismiss professional managing agents or property managers.</li>
          <li>Grant licenses for the use of common property.</li>
          <li>Borrow funds for major capital works with approval from a General Meeting.</li>
          <li>Invest surplus funds in approved financial instruments.</li>
          <li>Take disciplinary action against unit owners violating by-laws.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'admin',
    title: 'Administration & Funds',
    content: (
      <div className="mc-content">
        <h4>Administrative Fund</h4>
        <p>
          The Administrative Fund covers day-to-day operational expenses of the condominium,
          including cleaning, security, utilities for common areas, insurance premiums, and routine
          maintenance. All unit owners contribute to this fund based on their unit entitlement (share
          of common property).
        </p>

        <h4>Sinking Fund</h4>
        <p>
          The Sinking Fund is a long-term reserve for major capital expenditure such as lift
          replacement, roof repairs, external repainting, and major structural works. Under the
          Condominium Property Act, the MC is required to establish and maintain a Sinking Fund,
          with contributions from each unit owner.
        </p>

        <h4>Financial Reporting</h4>
        <ul>
          <li>Annual accounts must be audited by a qualified auditor.</li>
          <li>Financial statements are presented at the AGM for approval.</li>
          <li>Copies of audited accounts must be submitted to CMA.</li>
          <li>Unit owners have the right to inspect financial records at any time.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'unit_owners',
    title: 'Unit Owners\' Responsibilities',
    content: (
      <div className="mc-content">
        <p>Unit owners have both rights and responsibilities within the condominium:</p>
        <h4>Financial Obligations:</h4>
        <ul>
          <li>Pay maintenance levies on time as determined by the MC.</li>
          <li>Contribute to the sinking fund as required.</li>
          <li>Pay any special levies approved by a General Meeting.</li>
        </ul>
        <h4>Conduct &amp; Compliance:</h4>
        <ul>
          <li>Comply with the by-laws and rules of the condominium.</li>
          <li>Not carry out any works to the unit that affect structural integrity without MC consent.</li>
          <li>Notify the MC of any change of ownership or tenancy.</li>
          <li>Ensure tenants comply with the by-laws.</li>
          <li>Not create unreasonable noise or disturbance to other residents.</li>
        </ul>
        <h4>Participation:</h4>
        <ul>
          <li>Attend Annual General Meetings and exercise voting rights.</li>
          <li>Stand for election to the Management Council.</li>
          <li>Raise complaints or suggestions through proper channels.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'habits',
    title: 'Condominium Living Habits',
    content: (
      <div className="mc-content">
        <p>
          Harmonious condominium living depends on mutual respect and consideration among all
          residents. The following good habits are encouraged:
        </p>
        <ul>
          <li>
            <strong>Noise Control:</strong> Avoid loud music, renovations, or disturbances between
            10:00 PM and 7:00 AM.
          </li>
          <li>
            <strong>Common Area Etiquette:</strong> Keep corridors, lobbies, and recreational areas
            clean and free of personal belongings.
          </li>
          <li>
            <strong>Waste Disposal:</strong> Separate recyclables from general waste and use
            designated disposal points only.
          </li>
          <li>
            <strong>Parking:</strong> Park only in your designated parking bay and do not obstruct
            others.
          </li>
          <li>
            <strong>Pet Policy:</strong> Follow the MC's pet policy, including leash requirements
            and waste cleanup obligations.
          </li>
          <li>
            <strong>Energy Conservation:</strong> Switch off lights and air-conditioning in common
            areas when not in use.
          </li>
          <li>
            <strong>Visitor Management:</strong> Register guests as required and ensure they comply
            with building rules.
          </li>
          <li>
            <strong>Balcony &amp; Window:</strong> Do not hang laundry or leave items on balconies
            visible from outside where prohibited.
          </li>
          <li>
            <strong>Community Engagement:</strong> Participate in community events, AGMs, and
            initiatives that improve the condominium environment.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'fees',
    title: 'Registration Fees of Management Corporations',
    content: (
      <div className="mc-content">
        <p>
          The following fee schedule applies for the registration of Management Corporations with
          the Condominium Management Authority:
        </p>
        <div className="fee-table-wrapper">
          <table className="fee-table">
            <thead>
              <tr>
                <th>Number of Units</th>
                <th>Registration Fee (Rs.)</th>
                <th>Annual Return Fee (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 – 10 Units</td>
                <td>2,000</td>
                <td>1,000</td>
              </tr>
              <tr>
                <td>11 – 20 Units</td>
                <td>4,000</td>
                <td>2,000</td>
              </tr>
              <tr>
                <td>21 – 50 Units</td>
                <td>7,500</td>
                <td>3,500</td>
              </tr>
              <tr>
                <td>51 – 100 Units</td>
                <td>12,000</td>
                <td>6,000</td>
              </tr>
              <tr>
                <td>101 – 200 Units</td>
                <td>20,000</td>
                <td>10,000</td>
              </tr>
              <tr>
                <td>201 Units and above</td>
                <td>35,000</td>
                <td>15,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="fee-note">
          * All fees are subject to revision by the Minister. Please contact CMA for the latest fee
          schedule before making payment.
        </p>
        <Link to="/applications" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Apply for MC Registration
        </Link>
      </div>
    ),
  },
];

export default function ManagementCorpsPage() {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState('setup');

  useEffect(() => {
    document.title = 'Management Corporations – CMA Sri Lanka';
  }, []);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="mc-page">
      <PageHeroFallback
        title={t('mc.title', 'Management Corporations')}
        subtitle={t('mc.desc', 'Everything you need to know about forming and running a Management Corporation')}
      />

      <section className="section">
        <div className="container">
          <div className="mc-layout">
            {/* Sidebar TOC */}
            <div className="mc-sidebar">
              <div className="mc-toc">
                <h3>Quick Navigation</h3>
                <ul>
                  {ACCORDION_SECTIONS.map((s) => (
                    <li key={s.id}>
                      <button
                        className={`mc-toc-item ${openId === s.id ? 'active' : ''}`}
                        onClick={() => {
                          toggle(s.id);
                          document.getElementById(`mc-${s.id}`)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          });
                        }}
                      >
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Accordion */}
            <div className="mc-accordion">
              {ACCORDION_SECTIONS.map((sec, i) => (
                <motion.div
                  key={sec.id}
                  id={`mc-${sec.id}`}
                  className={`mc-panel ${openId === sec.id ? 'open' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <button className="mc-panel-trigger" onClick={() => toggle(sec.id)}>
                    <span>{sec.title}</span>
                    <motion.div
                      animate={{ rotate: openId === sec.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openId === sec.id && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="mc-panel-body-wrapper"
                      >
                        <div className="mc-panel-body">{sec.content}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
