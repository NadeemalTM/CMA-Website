import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle, ShieldCheck, FileText, Ruler, Map, 
  Car, HardHat, Sparkles, Droplets, Flame, 
  Thermometer, Wrench, Calendar, Key, Banknote, 
  Building, Users
} from 'lucide-react';

export default function BeforeBuyingCondoPage() {
  const { t } = useTranslation();

  const checklists = [
    {
      title: 'Building Regulations',
      desc: 'Check whether the plans have been prepared in accordance with current building regulations for the proposed condominium construction.',
      icon: FileText
    },
    {
      title: 'Adherence to Plans',
      desc: 'Check whether the construction has been completed according to the approved plan.',
      icon: Ruler
    },
    {
      title: 'Unauthorized Changes',
      desc: 'Be vigilant about whether the developer has made any alterations contrary to the plan at their own discretion during construction.',
      icon: ShieldCheck
    },
    {
      title: 'Amendments',
      desc: 'If any revisions are made, ensure they were carried out only after obtaining the necessary approvals.',
      icon: CheckCircle
    },
    {
      title: 'Land Boundaries',
      desc: 'Check whether construction has been carried out strictly within the land area owned by the developer.',
      icon: Map
    },
    {
      title: 'Parking Design',
      desc: 'Ensure that the parking layout was properly understood and correctly executed when marking the structural columns on the proposed construction plan.',
      icon: Car
    },
    {
      title: 'Professional Expertise',
      desc: 'Verify that the work has been completed by experienced contracting companies and that chartered engineering services were utilized.',
      icon: HardHat
    },
    {
      title: 'Quality of Finishes',
      desc: 'Be watchful for any low-quality finishing work.',
      icon: Sparkles
    },
    {
      title: 'Waterproofing',
      desc: 'Since buyers frequently face hardships regarding waterproofing, confirm that the work has been properly completed by recognized institutions with warranties, and that the warranty certificates have been duly handed over to the Management Corporation.',
      icon: Droplets
    },
    {
      title: 'Fire & Safety',
      desc: 'Ensure that fire safety certificates, lightning conductors, and fire protection equipment have been installed through recognized institutions with valid warranties.',
      icon: Flame
    },
    {
      title: 'Roof Insulation',
      desc: 'Check whether the roof/terrace has been completed using proper thermal insulation materials.',
      icon: Thermometer
    },
    {
      title: 'Plumbing Maintenance',
      desc: 'Confirm that all piping systems are arranged in a manner that allows easy maintenance for each respective service.',
      icon: Wrench
    },
    {
      title: 'Project Timeline',
      desc: 'Pay attention to whether the construction was completed by the agreed contractual date.',
      icon: Calendar
    },
    {
      title: 'Deed Issuance',
      desc: 'Be satisfied that all procedures up to the issuance of deeds for individual buyers have been properly completed.',
      icon: Key
    },
    {
      title: 'Financial Integrity',
      desc: 'Be vigilant regarding any financial fraud or irregularities in transactions with buyers.',
      icon: Banknote
    },
    {
      title: 'Mortgaged Properties',
      desc: 'If the property is mortgaged, ensure that it will be cleared in due time to guarantee that clean deeds are delivered to the buyers.',
      icon: Building
    },
    {
      title: 'Developer Support',
      desc: 'Ensure arrangements are made to secure the developer\'s assistance and guidance for maintenance work whenever necessary.',
      icon: Users
    },
    {
      title: 'Handover to Management Corporation',
      desc: 'Ensure that necessary steps are properly taken by the developer to establish the Management Corporation and hand over maintenance responsibilities to the homeowners.',
      icon: CheckCircle
    }
  ];

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', padding: '4rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            color: 'var(--crimson)', 
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            Living in a Clear Title Condominium Property
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#4b5563', 
            maxWidth: '800px', 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            To be entitled to live in a clear-title condominium property, the property developer must obtain a Condominium Certificate, certifying that the common elements and amenities conform to regulations. Without this Condominium Certificate, the property cannot be registered at the Land Registry, and consequently, the developer is unable to issue deeds for the condominium units. 
            <br/><br/>
            <strong>Therefore, before purchasing a condominium property, it is an essential requirement to verify with the Condominium Management Authority (CMA) whether the Condominium Certificate has been obtained for that property.</strong>
          </p>
        </div>

        {/* Checklist Title */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1f2937' }}>
            Key Checklist for Buyers
          </h2>
          <div style={{ 
            width: '60px', 
            height: '4px', 
            background: 'var(--gold)', 
            margin: '1rem auto 0',
            borderRadius: '2px'
          }}></div>
        </div>

        {/* Grid of Checklist Items */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {checklists.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                style={{
                  background: '#fff',
                  border: '1px solid var(--mid-gray)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ 
                    background: '#fff5f5', 
                    padding: '0.75rem', 
                    borderRadius: '50%', 
                    marginRight: '1rem',
                    color: 'var(--crimson)'
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                    {item.title}
                  </h3>
                </div>
                <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
