import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar as CalendarIcon,
  Building2,
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  CheckCircle,
  Info,
  ShieldCheck,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  Snowflake,
  Bed,
  Users,
  Eye,
  AlertCircle,
  Loader2,
  CheckCircle2,
  MapPin,
  Map,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBookingAvailability, submitBooking, getBungalowRooms, citizenUploadFile } from '../services/api';

// Room list loaded dynamically from backend API

export default function KataragamaBookingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { citizen, isCitizenLoggedIn } = useAuth();

  // Booking details state
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [currentRole, setCurrentRole] = useState('guest'); // guest or employee
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [checkinDateTime, setCheckinDateTime] = useState('');
  const [checkoutDateTime, setCheckoutDateTime] = useState('');
  const [selectedRooms, setSelectedRooms] = useState([]);

  const toggleRoomSelection = (room) => {
    if (selectedRooms.some(r => r.id === room.id)) {
      setSelectedRooms(selectedRooms.filter(r => r.id !== room.id));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Modal Wizard states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Form states
  const [guestFirst, setGuestFirst] = useState('');
  const [guestLast, setGuestLast] = useState('');
  const [guestNIC, setGuestNIC] = useState('');
  const [guestMobile, setGuestMobile] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [govLetter, setGovLetter] = useState('');
  const [isCmaEmployee, setIsCmaEmployee] = useState(false);
  const [familyCount, setFamilyCount] = useState(0);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [uploadingLetter, setUploadingLetter] = useState(false);

  // Payment states
  const [payMethod, setPayMethod] = useState('card'); // card, bank, wallet
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // OTP states
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const otpIntervalRef = useRef(null);
  const otpInputsRef = useRef([]);

  // Fetch Availability from API
  const fetchAvailability = async () => {
    setLoadingAvailability(true);
    try {
      const res = await getBookingAvailability();
      if (res.data && res.data.status === 'success') {
        setAvailability(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch booking availability:', err);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const res = await getBungalowRooms();
      setRooms(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch rooms list:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
    fetchRooms();
  }, []);

  // Set default form values when citizen logs in
  useEffect(() => {
    if (citizen) {
      const parts = citizen.name.split(' ');
      setGuestFirst(parts[0] || '');
      setGuestLast(parts.slice(1).join(' ') || '');
      setGuestEmail(citizen.email || '');
      setGuestMobile(citizen.phone || '');
      setGuestNIC(citizen.nic || '');
    }
  }, [citizen]);

  // OTP Timer countdown
  useEffect(() => {
    if (currentStep === 4) {
      setOtpTimer(60);
      clearInterval(otpIntervalRef.current);
      otpIntervalRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(otpIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(otpIntervalRef.current);
  }, [currentStep]);

  // Calculate nights (handles hourly stay cycle where <= 24H = 1 day, > 24H = 2 days, and ceil fractional days)
  const getNights = () => {
    if (!checkinDate || !checkoutDate) return 0;
    const diffMs = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.max(1, Math.ceil(diffHours / 24));
  };

  const nights = getNights();

  // Calculate price
  const getRoomPrice = (room) => {
    if (!room) return 0;
    const empPrice = room.emp_price !== undefined ? room.emp_price : room.empPrice;
    return currentRole === 'employee' ? empPrice : room.price;
  };

  const getSubtotal = () => {
    if (selectedRooms.length === 0 || nights === 0) return 0;
    return selectedRooms.reduce((sum, r) => sum + getRoomPrice(r), 0) * nights;
  };

  // Date manipulation helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Date formatting helpers
  const formatDateKey = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const formatDateLabel = (date) => {
    if (!date) return 'Select date & time';
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle calendar day click
  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const status = availability[dateKey] || 'available';

    if (status === 'booked') return; // Enforce disabled click for booked dates

    if (!checkinDate || (checkinDate && checkoutDate)) {
      setCheckinDate(clickedDate);
      setCheckoutDate(null);
    } else {
      if (clickedDate < checkinDate) {
        setCheckinDate(clickedDate);
        setCheckoutDate(null);
      } else {
        setCheckoutDate(clickedDate);
      }
    }
  };

  // Proceed button click
  const handleProceed = () => {
    if (!isCitizenLoggedIn) {
      // Direct them to the Login page with redirect param
      navigate('/login?redirect=/booking/kataragama');
    } else {
      // Logged in — open booking modal wizard
      setConfirmedBooking(null);
      setErrorMsg('');
      setCurrentStep(1);
      setModalOpen(true);
    }
  };

  // Guesthouse specific form handlers
  const handleGovLetterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLetter(true);
    try {
      const res = await citizenUploadFile(file);
      setGovLetter(res.data.path);
      alert('Official letter uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploadingLetter(false);
    }
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: '', nic: '' }]);
    setFamilyCount(c => c + 1);
  };

  const removeFamilyMember = (index) => {
    const newList = [...familyMembers];
    newList.splice(index, 1);
    setFamilyMembers(newList);
    setFamilyCount(c => Math.max(0, c - 1));
  };

  const handleFamilyMemberChange = (index, field, value) => {
    const newList = [...familyMembers];
    newList[index] = { ...newList[index], [field]: value };
    setFamilyMembers(newList);
  };

  // OTP inputs handling
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otpCode];
    newOtp[index] = val.substring(val.length - 1);
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  // Submit Booking transaction
  const handleVerifyOtpSubmit = async () => {
    const otp = otpCode.join('');
    if (otp !== '123456') {
      alert('Invalid OTP code. Please enter 123456 to simulate verification.');
      return;
    }

    setLoadingSubmit(true);
    setErrorMsg('');
    try {
      const bookingPromises = selectedRooms.map(room => {
        const payload = {
          guest_name: `${guestFirst} ${guestLast}`.trim(),
          email: guestEmail,
          phone: guestMobile,
          nic: guestNIC,
          employee_id: currentRole === 'employee' ? employeeId : null,
          unit_number: room.name,
          check_in: checkinDateTime.replace('T', ' '),
          check_out: checkoutDateTime.replace('T', ' '),
          adults: Number(adults),
          children: Number(children),
          amount: getRoomPrice(room) * nights,
          notes: specialRequests,
          permanent_address: permanentAddress,
          occupation: occupation,
          gov_letter: govLetter || null,
          is_cma_employee: Boolean(isCmaEmployee),
          family_count: Number(familyCount),
          family_members: familyMembers,
        };
        return submitBooking(payload);
      });

      const responses = await Promise.all(bookingPromises);
      const firstRes = responses[0];
      if (firstRes.data && firstRes.data.status === 'success') {
        const allBookings = responses.map(r => r.data.data);
        setConfirmedBooking({
          ...firstRes.data.data,
          unit_number: selectedRooms.map(r => r.name).join(', '),
          amount: getSubtotal(),
          allReferences: allBookings.map(b => `KTG-2026-${String(b.id).padStart(4, '0')}`).join(', '),
          allBookings: allBookings
        });
        setCurrentStep(5);
        fetchAvailability(); // Refresh calendar availability
      }
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'An error occurred during booking. Please try again.'
      );
      setCurrentStep(1); // Return to step 1 on error to let them review
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Card Format helper
  const handleCardNumberChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').substring(0, 16);
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(v);
    }
  };

  const handleCardExpiryChange = (e) => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 2) {
      v = v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    setCardExpiry(v);
  };

  // Calendar rendering math
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = [];
  // Fill empty days
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ day: null, empty: true });
  }
  // Fill month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), d);
    const status = availability[dateKey] || 'available';
    const thisDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);

    let isSelected = false;
    let isCheckoutDay = false;
    let isInRange = false;
    const isToday = new Date().toDateString() === thisDate.toDateString();

    if (checkinDate && checkoutDate) {
      const checkinTime = checkinDate.getTime();
      const checkoutTime = checkoutDate.getTime();
      const thisTime = thisDate.getTime();

      if (thisTime === checkinTime) isSelected = true;
      else if (thisTime === checkoutTime) isCheckoutDay = true;
      else if (thisTime > checkinTime && thisTime < checkoutTime) isInRange = true;
    } else if (checkinDate && checkinDate.getTime() === thisDate.getTime()) {
      isSelected = true;
    }

    calendarDays.push({
      day: d,
      empty: false,
      status,
      isSelected,
      isCheckoutDay,
      isInRange,
      isToday,
      date: thisDate,
    });
  }

  return (
    <div style={{ background: '#fcfbf9', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* ── Hero Section ── */}
      <section className="bk-hero">
        <div className="bk-hero-bg" />
        <div className="bk-hero-overlay" />
        <div className="bk-hero-inner">
          <div className="bk-hero-left">
            <div className="bk-hero-eyebrow">
              <Building2 size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              CMA Circuit Bungalow · Kataragama
            </div>
            <h1 className="bk-hero-title" style={{ marginTop: '10px' }}>
              Serene Retreat in<br />
              <em>Sacred Kataragama</em>
            </h1>
            <p className="bk-hero-desc">
              Reserve your stay at the Condominium Management Authority's exclusive circuit bungalow — nestled in the heart of Kataragama, offering tranquil accommodation for staff and visiting guests.
            </p>
          </div>
          <div className="bk-hero-gallery">
            <div className="bk-gallery-img">
              <img src="https://media-cdn.tripadvisor.com/media/photo-s/02/e0/70/a5/gem-river-edge-eco-home.jpg" alt="Kataragama Bungalow Exterior" />
            </div>
            <div className="bk-gallery-img">
              <img src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t1.6435-9/126420775_3373655879526837_7821034308813852164_n.jpg?stp=dst-jpg_s720x720_tt6&_nc_cat=105&ccb=1-7&_nc_sid=536f4a&_nc_ohc=6Em481u_fMsQ7kNvwF96b4W&_nc_oc=Adrl-T0oCfLcKv8qUlTmK__jLBVhnbJ7bJuKHTUigBn7ErJQYtWS8QPsSE9X7BVru8g&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=6NzPiXPSvoMCYsyqE1bduA&_nc_ss=78289&oh=00_Af8jNNXtdz07lJe2kKCi7bPMCQlzcf_mazyI1FuCJfdVHw&oe=6A4870E0" alt="Bungalow Living Room" />
            </div>
            <div className="bk-gallery-img">
              <img src="https://st5.depositphotos.com/19085394/64942/i/450/depositphotos_649426038-stock-photo-kirivehara-kiri-vehera-shrine-kataragama.jpg" alt="Kataragama Kiri Vehera Temple" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Role Selector ── */}
      <div className="role-selector-sec">
        <div className="role-selector-inner">
          <div className="role-row">
            <span className="role-label">I am a:</span>
            <button
              className={`role-btn${currentRole === 'guest' ? ' active' : ''}`}
              onClick={() => {
                setCurrentRole('guest');
                setSelectedRooms([]);
              }}
            >
              <User size={14} />
              Visiting Guest
              <span className="role-badge">Public</span>
            </button>
            <span style={{ marginLeft: 'auto', fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
              Secure Booking Portal · Condominium Management Authority
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Booking Layout ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="booking-layout">
          
          {/* Left area: Calendar + Room list */}
          <div>
            
            {/* Stay Period Selection Card */}
            <div className="avail-card" style={{ padding: '24px', borderRadius: '12px', background: '#fff', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)', marginBottom: '30px' }}>
              <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #eee', paddingBottom: '12px', color: 'var(--text-dark)' }}>
                <CalendarIcon size={18} style={{ color: 'var(--crimson)' }} />
                Select Stay Period & Check Availability
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                
                {/* Left Column: Form Selectors & Policy */}
                <div>
                  {/* Special Policy Notification */}
                  <div style={{ 
                    background: 'rgba(139, 0, 0, 0.05)', 
                    border: '1px solid rgba(139, 0, 0, 0.15)', 
                    borderRadius: '8px', 
                    padding: '12px 16px', 
                    marginBottom: '20px',
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '10px'
                  }}>
                    <Info size={16} style={{ color: 'var(--crimson)', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.4' }}>
                      <strong>Bungalow Stay Policy:</strong> Check-in is fixed at <strong>1:00 PM</strong> on the arrival date, and check-out is fixed at <strong>10:00 AM</strong> on the departure date. This stay period is automatically calculated as one day.
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)', marginBottom: '8px' }}>
                        Check-in Date *
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="date"
                          className="bk-form-input"
                          style={{ 
                            width: '100%', 
                            padding: '10px 14px', 
                            paddingRight: '80px',
                            borderRadius: '8px', 
                            border: '1px solid #ddd',
                            fontSize: '14px',
                            background: '#fff',
                            color: 'var(--text-dark)'
                          }}
                          value={checkinDateTime.split('T')[0] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const dt = `${val}T13:00`;
                              setCheckinDateTime(dt);
                              setCheckinDate(new Date(dt));
                            } else {
                              setCheckinDateTime('');
                              setCheckinDate(null);
                            }
                          }}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <span style={{ 
                          position: 'absolute', 
                          right: '12px', 
                          fontSize: '12px', 
                          color: 'var(--crimson)', 
                          fontWeight: '700',
                          pointerEvents: 'none'
                        }}>
                          1:00 PM
                        </span>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)', marginBottom: '8px' }}>
                        Check-out Date *
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="date"
                          className="bk-form-input"
                          style={{ 
                            width: '100%', 
                            padding: '10px 14px', 
                            paddingRight: '80px',
                            borderRadius: '8px', 
                            border: '1px solid #ddd',
                            fontSize: '14px',
                            background: '#fff',
                            color: 'var(--text-dark)'
                          }}
                          value={checkoutDateTime.split('T')[0] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const dt = `${val}T10:00`;
                              setCheckoutDateTime(dt);
                              setCheckoutDate(new Date(dt));
                            } else {
                              setCheckoutDateTime('');
                              setCheckoutDate(null);
                            }
                          }}
                          min={checkinDateTime ? checkinDateTime.split('T')[0] : new Date().toISOString().split('T')[0]}
                        />
                        <span style={{ 
                          position: 'absolute', 
                          right: '12px', 
                          fontSize: '12px', 
                          color: 'var(--crimson)', 
                          fontWeight: '700',
                          pointerEvents: 'none'
                        }}>
                          10:00 AM
                        </span>
                      </div>
                    </div>
                  </div>

                  {checkinDate && checkoutDate && (
                    <div style={{ 
                      background: 'rgba(201, 162, 39, 0.1)', 
                      border: '1px solid rgba(201, 162, 39, 0.3)', 
                      borderRadius: '8px', 
                      padding: '12px 16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--text-dark)' }}>
                        <Info size={16} style={{ color: '#C9A227' }} />
                        <span>Staying Duration:</span>
                        <strong>{nights} Day(s)</strong>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        (Calculated automatically)
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Column: Compact Availability Calendar */}
                <div style={{ borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-dark)' }}>
                      Availability Calendar
                    </span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button 
                        type="button" 
                        style={{ padding: '2px 8px', background: 'none', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        onClick={prevMonth}
                      >
                        ◀
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: '600', minWidth: '90px', textAlign: 'center', display: 'inline-block' }}>
                        {monthName}
                      </span>
                      <button 
                        type="button" 
                        style={{ padding: '2px 8px', background: 'none', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        onClick={nextMonth}
                      >
                        ▶
                      </button>
                    </div>
                  </div>

                  {/* Tiny Calendar Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {/* DOW headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                      <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                    </div>
                    {/* Days grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                      {calendarDays.map((item, idx) => {
                        if (item.empty) {
                          return <div key={`tiny-empty-${idx}`} style={{ height: '24px' }} />;
                        }

                        // Booked styling
                        const isBooked = item.status === 'booked';
                        const isPartial = item.status === 'partial';
                        let bg = '#eaf5ee'; // default available green tint
                        let color = '#2e6b4a';
                        let label = 'Available';

                        if (isBooked) {
                          bg = '#fbebeb'; // fully booked red tint
                          color = '#c93b3b';
                          label = 'Booked';
                        } else if (isPartial) {
                          bg = '#fff4eb'; // partial orange tint
                          color = '#d4622a';
                          label = 'Partial';
                        }

                        return (
                          <div
                            key={`tiny-day-${item.day}`}
                            title={`Day ${item.day}: ${label}`}
                            style={{
                              height: '26px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              background: bg,
                              color: color,
                              border: item.isToday ? '1px solid #C9A227' : 'none',
                              position: 'relative'
                            }}
                          >
                            {item.day}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tiny Legend */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2e6b4a' }}></div> Available
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d4622a' }}></div> Partial
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c93b3b' }}></div> Booked
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Select Room */}
            <div className="rooms-sec">
              <div className="rooms-sec-head">
                <h3 style={{ margin: 0 }}>Select Your Room</h3>
              </div>
              <div className="rooms-grid">
                {loadingRooms ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading available guesthouse rooms...
                  </div>
                ) : rooms.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No rooms configured at this time.
                  </div>
                ) : (
                  rooms.map((room) => {
                    const isSelected = selectedRooms.some(r => r.id === room.id);
                    const price = getRoomPrice(room);

                    return (
                      <div
                        key={room.id}
                        className={`room-card${isSelected ? ' selected-room' : ''}`}
                        onClick={() => toggleRoomSelection(room)}
                      >
                        {room.image ? (
                          <img
                            src={`/storage/${room.image}`}
                            alt={room.name}
                            className="room-img"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="room-img-placeholder"
                          style={{
                            display: room.image ? 'none' : 'flex',
                            fontSize: '2.5rem',
                          }}
                        >
                          {room.emoji || '🛏️'}
                        </div>
                        <div className="room-body">
                          <h4 className="room-name" style={{ margin: 0 }}>{room.name}</h4>
                          <div className="room-meta" style={{ marginTop: '8px' }}>
                            <div className="room-meta-item"><Bed size={13} /> {room.beds}</div>
                            <div className="room-meta-item"><Users size={13} /> {room.capacity}</div>
                            {room.ac && <div className="room-meta-item"><Snowflake size={13} /> A/C</div>}
                            <div className="room-meta-item"><Eye size={13} /> {room.view}</div>
                          </div>
                          <div className="room-price-row" style={{ marginTop: '16px' }}>
                            <div className="room-price">
                              Rs. {Number(price).toLocaleString()}
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>
                                {' '}/ night {currentRole === 'employee' && '(Staff)'}
                              </span>
                            </div>
                          </div>
                          <button
                            className="room-select-btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRoomSelection(room);
                            }}
                          >
                            {isSelected ? '✓ Selected' : 'Select Room'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Summary */}
          <div className="booking-sidebar">
            
            <div className="bk-summary-card">
              <div className="bk-sum-head">
                <h4 style={{ margin: 0 }}>Booking Summary</h4>
                <p style={{ margin: '4px 0 0', fontSize: '11.5px', opacity: 0.85 }}>Review your reservation</p>
              </div>
              <div className="bk-sum-body">
                <div className="bk-sum-row">
                  <span className="bk-sum-label">Property</span>
                  <span className="bk-sum-value">Kataragama Bungalow</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label">Room(s)</span>
                  <span className="bk-sum-value">{selectedRooms.length > 0 ? selectedRooms.map(r => r.name).join(', ') : 'Not selected'}</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label">Check-In</span>
                  <span className="bk-sum-value">{formatDateLabel(checkinDate)}</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label">Check-Out</span>
                  <span className="bk-sum-value">{formatDateLabel(checkoutDate)}</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label">Nights</span>
                  <span className="bk-sum-value">{nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : '—'}</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label">Guests</span>
                  <span className="bk-sum-value">{adults} Adult(s), {children} Child(ren)</span>
                </div>
                {selectedRooms.length > 0 && (
                  <div className="bk-sum-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <span className="bk-sum-label">{currentRole === 'employee' ? 'Staff Rate/Night' : 'Rate/Night'}</span>
                    <div style={{ width: '100%', paddingLeft: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {selectedRooms.map(r => (
                        <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{r.name}:</span>
                          <span>Rs. {getRoomPrice(r).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bk-sum-total">
                  <span className="bk-sum-total-label">Total Amount</span>
                  <span className="bk-sum-total-val">Rs. {getSubtotal().toLocaleString()}</span>
                </div>

                <button
                  className="bk-proceed-btn"
                  type="button"
                  onClick={handleProceed}
                  disabled={selectedRooms.length === 0 || !checkinDate || !checkoutDate || nights <= 0}
                >
                  <Lock size={15} />
                  Proceed to Book
                </button>

                <div className="bk-trust-items" style={{ marginTop: '16px' }}>
                  <div className="bk-trust-item"><ShieldCheck size={14} style={{ color: 'var(--success)' }} /> Secure SSL Booking</div>
                  <div className="bk-trust-item"><ShieldCheck size={14} style={{ color: 'var(--success)' }} /> Free Cancellation 48hrs prior</div>
                  <div className="bk-trust-item"><ShieldCheck size={14} style={{ color: 'var(--success)' }} /> OTP Verified payment simulation</div>
                </div>
              </div>
            </div>

            {/* Need Help card */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dark)', marginBottom: '12px' }}>
                <Phone size={14} style={{ color: 'var(--crimson)' }} />
                Need Booking Assistance?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <div>📞 011 233 8146</div>
                <div>✉ bungalow@condominium.lk</div>
                <div>🕒 Mon–Fri, 8:30am–4:30pm</div>
              </div>
            </div>

            {/* Bungalow Location Card */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '20px', boxShadow: 'var(--shadow-sm)', marginTop: '20px' }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dark)', marginBottom: '12px' }}>
                <MapPin size={14} style={{ color: 'var(--crimson)' }} />
                Bungalow Location
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Detour Road, Kataragama, Sri Lanka. Conveniently situated close to the sacred temples.
              </p>
              <a 
                href="https://maps.app.goo.gl/PkPj7oFnBFLMbA9n7" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '6px', 
                  textDecoration: 'none',
                  backgroundColor: 'var(--crimson)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b0000'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--crimson)'}
              >
                <Map size={14} />
                View on Google Maps
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* ── Facilities Section ── */}
      <section className="section facilities-sec">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="section-label">Amenities</span>
            <h2 className="section-title">Bungalow Facilities</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Enjoy standard facilities at the CMA Circuit Bungalow — designed for a comfortable retreat.
            </p>
          </div>
          <div className="facilities-grid">
            <div className="facility-card">
              <span className="facility-icon">🛏️</span>
              <h4 className="facility-name">Comfortable Rooms</h4>
              <p className="facility-desc">Quality beds, linen, hot water showers, and optional AC setups.</p>
            </div>
            <div className="facility-card">
              <span className="facility-icon">🍽️</span>
              <h4 className="facility-name">Dining Hall</h4>
              <p className="facility-desc">Spacious seating with kitchen setups available for visiting guests.</p>
            </div>
            <div className="facility-card">
              <span className="facility-icon">🌿</span>
              <h4 className="facility-name">Surrounding Gardens</h4>
              <p className="facility-desc">Beautiful lush courtyard garden surrounding the premises.</p>
            </div>
            <div className="facility-card">
              <span className="facility-icon">🅿️</span>
              <h4 className="facility-name">Free Vehicle Parking</h4>
              <p className="facility-desc">On-site secure parking space inside the gated boundaries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Multi-Step Checkout Modal ── */}
      {modalOpen && (
        <div className="bk-modal-overlay open">
          <div className="bk-modal">
            <div className="bk-modal-head">
              <span className="bk-modal-title">Complete Reservation</span>
              <button className="bk-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="bk-modal-body">
              
              {/* Stepper Header */}
              <div className="bk-steps">
                <div className={`bk-step${currentStep >= 1 ? ' active' : ''}${currentStep > 1 ? ' done' : ''}`}>
                  <div className="bk-step-circle">1</div>
                  <div className="bk-step-label">Guest Info</div>
                </div>
                <div className={`bk-step${currentStep >= 2 ? ' active' : ''}${currentStep > 2 ? ' done' : ''}`}>
                  <div className="bk-step-circle">2</div>
                  <div className="bk-step-label">Review</div>
                </div>
                <div className={`bk-step${currentStep >= 3 ? ' active' : ''}${currentStep > 3 ? ' done' : ''}`}>
                  <div className="bk-step-circle">3</div>
                  <div className="bk-step-label">Payment</div>
                </div>
                <div className={`bk-step${currentStep >= 4 ? ' active' : ''}${currentStep > 4 ? ' done' : ''}`}>
                  <div className="bk-step-circle">4</div>
                  <div className="bk-step-label">OTP Verify</div>
                </div>
                <div className={`bk-step${currentStep >= 5 ? ' active' : ''}`}>
                  <div className="bk-step-circle">✓</div>
                  <div className="bk-step-label">Done</div>
                </div>
              </div>

              {/* Step 1: Guest Info */}
              {currentStep === 1 && (
                <div className="bk-form-section active">
                  <h4 style={{ margin: '0 0 16px', fontWeight: 700 }}>Guest Information</h4>
                  
                  {/* Period of stay times notice (timings 2.00pm / 10.00am) */}
                  <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>⏰</span>
                    <span>
                      <strong> stay period limits:</strong> check-in starts at <strong>2:00 p.m.</strong>, check-out is strictly before <strong>10:00 a.m.</strong>
                    </span>
                  </div>

                  <div className="bk-form-row">
                    <div className="bk-form-group">
                      <label className="bk-form-label">First Name *</label>
                      <input type="text" className="bk-form-input" value={guestFirst} onChange={e => setGuestFirst(e.target.value)} required />
                    </div>
                    <div className="bk-form-group">
                      <label className="bk-form-label">Last Name *</label>
                      <input type="text" className="bk-form-input" value={guestLast} onChange={e => setGuestLast(e.target.value)} required />
                    </div>
                  </div>
                  <div className="bk-form-group">
                    <label className="bk-form-label">NIC / Passport Number *</label>
                    <input type="text" className="bk-form-input" value={guestNIC} onChange={e => setGuestNIC(e.target.value)} required />
                  </div>
                  <div className="bk-form-group">
                    <label className="bk-form-label">Permanent Address *</label>
                    <textarea className="bk-form-input" rows={2} value={permanentAddress} onChange={e => setPermanentAddress(e.target.value)} required placeholder="Enter your full permanent address" />
                  </div>
                  <div className="bk-form-row">
                    <div className="bk-form-group">
                      <label className="bk-form-label">Mobile Number *</label>
                      <input type="text" className="bk-form-input" value={guestMobile} onChange={e => setGuestMobile(e.target.value)} required />
                    </div>
                    <div className="bk-form-group">
                      <label className="bk-form-label">Email Address *</label>
                      <input type="email" className="bk-form-input" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div className="bk-form-row" style={{ gridTemplateColumns: '1.2fr 1fr', alignItems: 'center' }}>
                    <div className="bk-form-group">
                      <label className="bk-form-label">Occupation *</label>
                      <input type="text" className="bk-form-input" value={occupation} onChange={e => setOccupation(e.target.value)} required placeholder="e.g. Government Executive" />
                    </div>
                    <div className="bk-form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.25rem' }}>
                      <input type="checkbox" id="isCmaEmpCheckbox" checked={isCmaEmployee} onChange={e => setIsCmaEmployee(e.target.checked)} style={{ width: '18px', height: '18px', marginRight: '8px', cursor: 'pointer' }} />
                      <label htmlFor="isCmaEmpCheckbox" style={{ fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Employed at Ministry / CMA?</label>
                    </div>
                  </div>

                  {/* Gov Institution official letter upload */}
                  <div style={{ background: '#fafafa', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                    <label className="bk-form-label" style={{ margin: 0, fontWeight: 700, fontSize: '13px' }}>Government Institution Employee? (Optional)</label>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '8px', lineHeight: 1.4 }}>
                      If employed in a government institution, please attach an official letter confirming employment.
                    </span>
                    <input type="file" accept=".pdf,image/*" onChange={handleGovLetterUpload} style={{ display: 'block', fontSize: '12px', width: '100%' }} />
                    {uploadingLetter && <div style={{ fontSize: '11px', color: 'var(--crimson)', marginTop: '4px', fontWeight: 600 }}>Uploading official letter...</div>}
                    {govLetter && <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>✓ Official letter uploaded successfully.</div>}
                  </div>

                  {currentRole === 'employee' && (
                    <div className="bk-form-group">
                      <label className="bk-form-label">CMA Employee ID *</label>
                      <input type="text" className="bk-form-input" placeholder="e.g. CMA-STF-889" value={employeeId} onChange={e => setEmployeeId(e.target.value)} required />
                      <div className="bk-form-hint">Please enter your official employee credentials.</div>
                    </div>
                  )}
                  
                  <div className="bk-form-row">
                    <div className="bk-form-group">
                      <label className="bk-form-label">No. of Adults *</label>
                      <select className="bk-form-select" value={adults} onChange={e => setAdults(e.target.value)}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </div>
                    <div className="bk-form-group">
                      <label className="bk-form-label">No. of Children</label>
                      <select className="bk-form-select" value={children} onChange={e => setChildren(e.target.value)}>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                  </div>

                  {/* Accompanying Family Members dynamic table */}
                  <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px', marginBottom: '16px', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <label className="bk-form-label" style={{ margin: 0, fontWeight: 700, fontSize: '13px' }}>Accompanying Family Members ({familyCount})</label>
                      <button type="button" onClick={addFamilyMember} style={{ padding: '4px 8px', fontSize: '11px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Add Accompanying Member</button>
                    </div>
                    
                    {familyMembers.length === 0 ? (
                      <div style={{ fontSize: '12px', color: '#64748b', padding: '10px', textAlign: 'center', background: '#f8fafc', borderRadius: '6px' }}>
                        No family members registered. Accompanying members can be added above.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {familyMembers.map((member, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              className="bk-form-input"
                              placeholder="Family Member Name"
                              value={member.name}
                              onChange={e => handleFamilyMemberChange(idx, 'name', e.target.value)}
                              style={{ padding: '6px 8px', fontSize: '12px' }}
                              required
                            />
                            <input
                              type="text"
                              className="bk-form-input"
                              placeholder="NIC No. / Passport"
                              value={member.nic}
                              onChange={e => handleFamilyMemberChange(idx, 'nic', e.target.value)}
                              style={{ padding: '6px 8px', fontSize: '12px' }}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => removeFamilyMember(idx)}
                              style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#dc2626', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bk-form-group">
                    <label className="bk-form-label">Special Requests (Optional)</label>
                    <textarea className="bk-form-input" rows={2} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="Late check-in, dietary, ground floor..." />
                  </div>
                  <div className="bk-btn-row">
                    <button
                      className="bk-btn-next"
                      type="button"
                      disabled={!guestFirst || !guestLast || !guestNIC || !guestMobile || !guestEmail || !permanentAddress || !occupation || (currentRole === 'employee' && !employeeId)}
                      onClick={() => setCurrentStep(2)}
                    >
                      Continue to Review →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Review */}
              {currentStep === 2 && (
                <div className="bk-form-section active">
                  <h4 style={{ margin: '0 0 16px', fontWeight: 700 }}>Review Details</h4>
                  <div style={{ background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Guest Name</span>
                      <strong style={{ color: 'var(--text-dark)' }}>{guestFirst} {guestLast}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>NIC Number</span>
                      <strong>{guestNIC}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Contact Details</span>
                      <strong>{guestMobile} | {guestEmail}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Permanent Address</span>
                      <strong style={{ maxWidth: '240px', textAlign: 'right', whiteSpace: 'pre-wrap' }}>{permanentAddress}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Occupation</span>
                      <strong>{occupation}</strong>
                    </div>
                    {isCmaEmployee && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Ministry / CMA Staff</span>
                        <strong style={{ color: '#16a34a' }}>Yes</strong>
                      </div>
                    )}
                    {govLetter && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Official Gov Letter</span>
                        <strong style={{ color: '#16a34a' }}>Attached</strong>
                      </div>
                    )}
                    {familyMembers.length > 0 && (
                      <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', fontSize: '12.5px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Accompanying Members ({familyCount}):</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                          {familyMembers.map((m, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>• {m.name}</span>
                              <span style={{ color: 'var(--text-muted)' }}>NIC: {m.nic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Room(s) Selection</span>
                      <strong style={{ color: 'var(--crimson)' }}>{selectedRooms.map(r => r.name).join(', ')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Check-In</span>
                      <strong>{formatDateLabel(checkinDate)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Check-Out</span>
                      <strong>{formatDateLabel(checkoutDate)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Nights</span>
                      <strong>{nights} night{nights > 1 ? 's' : ''}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Amount</span>
                      <strong style={{ fontSize: '16px', color: 'var(--crimson)' }}>Rs. {getSubtotal().toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="bk-btn-row">
                    <button className="bk-btn-back" type="button" onClick={() => setCurrentStep(1)}>Back</button>
                    <button className="bk-btn-next" type="button" onClick={() => setCurrentStep(3)}>Proceed to Payment →</button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="bk-form-section active">
                  <h4 style={{ margin: '0 0 16px', fontWeight: 700 }}>Secure Payment Simulation</h4>
                  <div className="pay-methods">
                    <div className={`pay-method${payMethod === 'card' ? ' active' : ''}`} onClick={() => setPayMethod('card')}>
                      <span className="pay-method-icon">💳</span>
                      <div className="pay-method-label">Credit/Debit</div>
                    </div>
                    <div className={`pay-method${payMethod === 'bank' ? ' active' : ''}`} onClick={() => setPayMethod('bank')}>
                      <span className="pay-method-icon">🏦</span>
                      <div className="pay-method-label">Bank Transfer</div>
                    </div>
                    <div className={`pay-method${payMethod === 'wallet' ? ' active' : ''}`} onClick={() => setPayMethod('wallet')}>
                      <span className="pay-method-icon">📱</span>
                      <div className="pay-method-label">e-Wallet</div>
                    </div>
                  </div>

                  {payMethod === 'card' ? (
                    <>
                      <div className="card-preview">
                        <div className="card-chip" />
                        <div className="card-number">{cardNumber || '•••• •••• •••• ••••'}</div>
                        <div className="card-info-row">
                          <div>
                            <div className="card-holder">Card Holder</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>{cardName || 'YOUR NAME'}</div>
                          </div>
                          <div>
                            <div className="card-expiry">Expires</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{cardExpiry || 'MM/YY'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="pay-card-fields">
                        <div className="bk-form-group">
                          <label className="bk-form-label">Cardholder Name *</label>
                          <input type="text" className="bk-form-input" placeholder="Kamal Perera" value={cardName} onChange={e => setCardName(e.target.value)} required />
                        </div>
                        <div className="bk-form-group">
                          <label className="bk-form-label">Card Number *</label>
                          <input type="text" className="bk-form-input" placeholder="4111 2222 3333 4444" value={cardNumber} onChange={handleCardNumberChange} required />
                        </div>
                        <div className="pay-card-row">
                          <div className="bk-form-group">
                            <label className="bk-form-label">Expiry Date *</label>
                            <input type="text" className="bk-form-input" placeholder="MM/YY" value={cardExpiry} onChange={handleCardExpiryChange} required />
                          </div>
                          <div className="bk-form-group">
                            <label className="bk-form-label">CVV *</label>
                            <input type="password" placeholder="•••" className="bk-form-input" value={cardCVV} onChange={e => setCardCVV(e.target.value.substring(0, 3))} required />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '24px', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                      ℹ Selected payment method is in simulation mode. Standard demo checks require completing checkout via Credit/Debit card form and inputting the mock OTP verification code.
                    </div>
                  )}

                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', fontSize: '12.5px', color: '#15803d', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '18px' }}>
                    <Lock size={14} />
                    <span>SSL encrypted transaction. Booking amount: <strong>Rs. {getSubtotal().toLocaleString()}</strong></span>
                  </div>

                  <div className="bk-btn-row">
                    <button className="bk-btn-back" type="button" onClick={() => setCurrentStep(2)}>Back</button>
                    <button
                      className="bk-btn-next"
                      type="button"
                      disabled={payMethod === 'card' && (!cardName || !cardNumber || !cardExpiry || !cardCVV)}
                      onClick={() => setCurrentStep(4)}
                    >
                      Pay & Get OTP →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: OTP Verification */}
              {currentStep === 4 && (
                <div className="bk-form-section active">
                  <div className="otp-container">
                    <div className="otp-icon">📲</div>
                    <h3 className="otp-heading" style={{ margin: 0 }}>OTP Verification</h3>
                    <p className="otp-sub" style={{ marginTop: '8px' }}>
                      A 6-digit One-Time Password has been sent to your simulated mobile number <strong>{guestMobile || '+94 77 *** ****'}</strong>. Please enter it below to confirm your payment.
                    </p>
                    
                    <div className="otp-input-row" style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '20px 0' }}>
                      {otpCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputsRef.current[index] = el)}
                          type="text"
                          maxLength={1}
                          className="otp-digit"
                          value={digit}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          style={{
                            width: '45px',
                            height: '52px',
                            borderRadius: '8px',
                            border: '2px solid #ddd',
                            textAlign: 'center',
                            fontSize: '20px',
                            fontWeight: 700,
                          }}
                        />
                      ))}
                    </div>

                    <div className="otp-resend" style={{ fontSize: '13px' }}>
                      Didn't receive the OTP? <button style={{ color: 'var(--crimson)', fontWeight: 700, border: 'none', background: 'none' }} onClick={() => setOtpTimer(60)}>Resend</button> {otpTimer > 0 && <span className="otp-timer">({otpTimer}s)</span>}
                    </div>

                    <div style={{ background: 'rgba(139,26,26,.06)', borderRadius: '10px', padding: '12px 16px', fontSize: '12.5px', color: 'var(--text-body)', margin: '20px 0 0', textAlign: 'left', border: '1px dashed var(--crimson)' }}>
                      <strong>Demo Simulation:</strong> Enter <strong style={{ color: 'var(--crimson)' }}>1 2 3 4 5 6</strong> to verify transaction successfully.
                    </div>
                  </div>

                  <div className="bk-btn-row" style={{ marginTop: '24px' }}>
                    <button className="bk-btn-back" type="button" onClick={() => setCurrentStep(3)}>Back</button>
                    <button
                      className="bk-btn-next"
                      type="button"
                      disabled={loadingSubmit}
                      onClick={handleVerifyOtpSubmit}
                    >
                      {loadingSubmit ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', marginRight: '6px' }} /> : null}
                      Confirm Booking & Pay
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Confirmed Success */}
              {currentStep === 5 && confirmedBooking && (
                <div className="bk-form-section active">
                  <div className="bk-success">
                    <div className="bk-success-icon" style={{ fontSize: '3.5rem' }}>🎉</div>
                    <h3 className="bk-success-title" style={{ margin: '10px 0 0' }}>Booking Confirmed!</h3>
                    <p className="bk-success-sub" style={{ marginTop: '8px' }}>
                      Your stay at the Condominium Management Authority's circuit bungalow in Kataragama is confirmed. Details have been recorded under your citizen account.
                    </p>
                    
                    <div className="bk-ref-box">
                      <div className="bk-ref-label">Booking Reference Number(s)</div>
                      <div className="bk-ref-num">
                        {confirmedBooking.allReferences 
                          ? confirmedBooking.allReferences 
                          : `KTG-2026-${String(confirmedBooking.id).padStart(4, '0')}`}
                      </div>
                    </div>

                    <div className="bk-success-details">
                      <div>
                        <strong>Room Type:</strong>
                        <span>{confirmedBooking.unit_number}</span>
                      </div>
                      <div>
                        <strong>Check-In Date:</strong>
                        <span>{confirmedBooking.check_in}</span>
                      </div>
                      <div>
                        <strong>Check-Out Date:</strong>
                        <span>{confirmedBooking.check_out}</span>
                      </div>
                      <div>
                        <strong>Total Amount Paid:</strong>
                        <span style={{ color: 'var(--success)', fontWeight: 700 }}>Rs. {Number(confirmedBooking.amount).toLocaleString()}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'center' }}>
                      <button
                        className="btn btn-outline"
                        style={{ borderRadius: '8px', padding: '10px 20px', fontSize: '13px' }}
                        onClick={() => window.print()}
                      >
                        <Printer size={14} /> Print / Save PDF
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ borderRadius: '8px', padding: '10px 20px', fontSize: '13px' }}
                        onClick={() => {
                          setModalOpen(false);
                          setSelectedRooms([]);
                          setCheckinDate(null);
                          setCheckoutDate(null);
                        }}
                      >
                        Finish
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <style>{`
        /* CUSTOM OVERRIDES FOR KATARAGAMA CIRCUIT BUNGALOW VIEW */
        .bk-hero {
          position: relative;
          min-height: 440px;
          overflow: hidden;
          background: #000;
          display: flex;
          align-items: center;
        }
        .bk-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1400&auto=format&fit=crop&q=70');
          background-size: cover;
          background-position: center;
          opacity: 0.55;
        }
        .bk-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(26,20,16,.92) 0%, rgba(139,26,26,.55) 60%, rgba(26,20,16,.6) 100%);
        }
        .bk-hero-inner {
          position: relative;
          z-index: 2;
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 72px 24px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: center;
          width: 100%;
        }
        .bk-hero-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--gold-light);
          background: rgba(201,162,39,0.15);
          border: 1px solid rgba(201,162,39,0.3);
          border-radius: 100px;
          padding: 6px 14px;
          display: inline-block;
        }
        .bk-hero-title {
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 14px;
        }
        .bk-hero-title em {
          color: var(--gold-light);
          font-style: italic;
        }
        .bk-hero-desc {
          font-size: 14.5px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin-bottom: 28px;
          max-width: 520px;
        }
        .bk-stats-row {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
        }
        .bk-stat {
          text-align: left;
        }
        .bk-stat-num {
          font-size: 24px;
          font-weight: 800;
          color: var(--gold-light);
        }
        .bk-stat-lbl {
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          font-weight: 600;
          letter-spacing: .04em;
          display: block;
          margin-top: 2px;
        }
        .bk-hero-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .bk-gallery-img {
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(201,162,39,.2);
        }
        .bk-gallery-img img {
          width: 100%;
          height: 274px;
          object-fit: cover;
          display: block;
          transition: transform .4s;
        }
        .bk-gallery-img:hover img {
          transform: scale(1.05);
        }

        /* USER ROLE SELECTOR */
        .role-selector-sec {
          background: #f7f5f2;
          border-bottom: 1px solid var(--mid-gray);
        }
        .role-selector-inner {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 20px 24px;
        }
        .role-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .role-label {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-dark);
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .role-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 100px;
          border: 2px solid var(--mid-gray);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: #fff;
          color: var(--text-body);
          transition: all .25s;
        }
        .role-btn:hover {
          border-color: var(--crimson);
          color: var(--crimson);
        }
        .role-btn.active {
          background: var(--crimson);
          border-color: var(--crimson);
          color: #fff;
          box-shadow: var(--shadow-crimson);
        }
        .role-badge {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 100px;
          font-weight: 700;
          letter-spacing: .05em;
        }
        .role-btn.active .role-badge {
          background: rgba(255,255,255,.2);
          color: #fff;
        }
        .role-btn .role-badge {
          background: rgba(139,0,0,.08);
          color: var(--crimson);
        }
        #roleEmployee.active {
          background: linear-gradient(135deg, var(--crimson-dark), var(--crimson));
          border-color: var(--crimson);
        }

        /* MAIN BOOKING LAYOUT */
        .booking-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 36px;
          align-items: start;
        }

        /* AVAILABILITY CALENDAR */
        .avail-card {
          background: #fff;
          border-radius: var(--radius-md);
          border: 1px solid var(--mid-gray);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .avail-head {
          background: linear-gradient(135deg, var(--crimson-dark), var(--crimson));
          padding: 22px 24px;
          color: #fff;
        }
        .avail-head-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .avail-nav {
          display: flex;
          gap: 6px;
        }
        .avail-nav-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,.3);
          background: rgba(255,255,255,.1);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .2s;
        }
        .avail-nav-btn:hover {
          background: rgba(255,255,255,.25);
        }
        .avail-month-label {
          font-size: 13px;
          color: rgba(255,255,255,.7);
          letter-spacing: .04em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .avail-legend {
          display: flex;
          gap: 16px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .avail-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .avail-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,.8);
        }
        .cal-grid {
          padding: 20px 24px;
        }
        .cal-dow {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 8px;
        }
        .cal-dow span {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: .06em;
          padding: 6px 0;
          text-transform: uppercase;
        }
        .cal-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .cal-day {
          aspect-ratio: 1.2;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          transition: all .2s;
          border: 1.5px solid transparent;
        }
        .cal-day.empty {
          cursor: default;
        }
        .cal-day.available {
          background: rgba(26,127,90,.08);
          color: var(--success);
          border-color: rgba(26,127,90,.2);
        }
        .cal-day.available:hover {
          background: rgba(26,127,90,.18);
          transform: scale(1.08);
        }
        .cal-day.partial {
          background: rgba(217,119,6,.08);
          color: var(--warning);
          border-color: rgba(217,119,6,.2);
        }
        .cal-day.partial:hover {
          background: rgba(217,119,6,.18);
          transform: scale(1.08);
        }
        .cal-day.booked {
          background: rgba(139,0,0,.06);
          color: var(--text-muted);
          cursor: not-allowed;
          border-color: rgba(139,0,0,.1);
        }
        .cal-day.today {
          box-shadow: 0 0 0 2px var(--gold);
        }
        .cal-day.selected {
          background: var(--crimson)!important;
          color: #fff!important;
          border-color: var(--crimson)!important;
          box-shadow: var(--shadow-crimson);
        }
        .cal-day.checkout-day {
          background: var(--gold)!important;
          color: #fff!important;
          border-color: var(--gold)!important;
        }
        .cal-day.in-range {
          background: rgba(139,0,0,.08);
          border-color: transparent;
        }
        .cal-day.user-blocked {
          cursor: not-allowed;
          opacity: .55;
          filter: grayscale(.4);
        }
        .cal-day.user-blocked:hover {
          transform: none!important;
          background: inherit!important;
        }
        .cal-user-notice {
          margin: 0 24px 18px;
          padding: 10px 14px;
          background: rgba(139,0,0,.04);
          border: 1px solid rgba(139,0,0,.15);
          border-radius: 8px;
          font-size: 12px;
          color: var(--crimson);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .avail-detail-row {
          padding: 0 24px 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .avail-room-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          border: 1.5px solid #eee;
        }
        .chip-green { background: rgba(26,127,90,.04); color: var(--success); border-color: rgba(26,127,90,.15); }
        .chip-orange { background: rgba(217,119,6,.04); color: var(--warning); border-color: rgba(217,119,6,.15); }
        .chip-red { background: rgba(139,0,0,.04); color: var(--crimson); border-color: rgba(139,0,0,.1); }

        /* ROOM LISTINGS */
        .rooms-sec {
          margin-top: 32px;
        }
        .rooms-sec-head h3 {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 16px;
        }
        .rooms-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .room-card {
          background: #fff;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--mid-gray);
          overflow: hidden;
          transition: var(--transition);
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }
        .room-card:hover {
          box-shadow: var(--shadow-md);
          border-color: rgba(139,0,0,.2);
          transform: translateY(-3px);
        }
        .room-card.selected-room {
          border-color: var(--crimson);
          box-shadow: 0 0 0 3px rgba(139,0,0,.12);
        }
        .room-img {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }
        .room-img-placeholder {
          width: 100%;
          height: 140px;
          background: linear-gradient(135deg, var(--light-gray), var(--off-white));
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .room-body {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .room-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-dark);
        }
        .room-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .room-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-muted);
          background: var(--off-white);
          padding: 3px 8px;
          border-radius: 4px;
        }
        .room-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .room-price {
          font-size: 18px;
          font-weight: 800;
          color: var(--crimson);
        }
        .room-select-btn {
          width: 100%;
          margin-top: 12px;
          padding: 8px;
          border-radius: 6px;
          border: 1.5px solid var(--crimson);
          background: #fff;
          color: var(--crimson);
          font-size: 12px;
          font-weight: 700;
          transition: all 0.2s;
        }
        .room-select-btn:hover, .room-card.selected-room .room-select-btn {
          background: var(--crimson);
          color: #fff;
        }

        /* BOOKING SIDEBAR */
        .booking-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 120px;
        }
        .bk-summary-card {
          background: #fff;
          border-radius: var(--radius-md);
          border: 1px solid var(--mid-gray);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .bk-sum-head {
          background: linear-gradient(135deg, var(--crimson-dark), var(--crimson));
          padding: 18px 22px;
          color: #fff;
        }
        .bk-sum-body {
          padding: 20px 22px;
        }
        .bk-sum-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--light-gray);
          font-size: 13px;
        }
        .bk-sum-row:last-child {
          border-bottom: none;
        }
        .bk-sum-label {
          color: var(--text-muted);
          font-weight: 500;
        }
        .bk-sum-value {
          color: var(--text-dark);
          font-weight: 600;
          text-align: right;
          max-width: 60%;
        }
        .bk-sum-total {
          background: var(--off-white);
          border-radius: 8px;
          padding: 12px 16px;
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .bk-sum-total-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-body);
        }
        .bk-sum-total-val {
          font-size: 20px;
          font-weight: 800;
          color: var(--crimson);
        }
        .bk-proceed-btn {
          width: 100%;
          margin-top: 16px;
          padding: 12px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--crimson-dark), var(--crimson));
          color: #fff;
          border: none;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: var(--transition);
        }
        .bk-proceed-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-crimson);
        }
        .bk-proceed-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .bk-trust-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .bk-trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: var(--text-muted);
        }

        /* FACILITIES */
        .facilities-sec {
          background: var(--off-white);
        }
        .facilities-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .facility-card {
          background: #fff;
          border-radius: var(--radius-md);
          padding: 24px 20px;
          text-align: center;
          border: 1px solid var(--mid-gray);
          transition: var(--transition);
        }
        .facility-card:hover {
          box-shadow: var(--shadow-md);
          border-color: rgba(139,0,0,.1);
          transform: translateY(-4px);
        }
        .facility-icon {
          font-size: 2.2rem;
          margin-bottom: 12px;
          display: block;
        }
        .facility-name {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 6px;
        }
        .facility-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* BOOKING FORM MODAL */
        .bk-modal-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 3500;
          background: rgba(0,0,0,.6);
          backdrop-filter: blur(4px);
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .bk-modal-overlay.open {
          display: flex;
        }
        .bk-modal {
          background: #fff;
          border-radius: 16px;
          max-width: 580px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
        }
        .bk-modal-head {
          background: linear-gradient(135deg, var(--crimson-dark), var(--crimson));
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #fff;
        }
        .bk-modal-title {
          font-size: 16.5px;
          font-weight: 700;
        }
        .bk-modal-close {
          background: rgba(255,255,255,.15);
          border: none;
          color: #fff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bk-modal-body {
          padding: 24px;
        }
        .bk-steps {
          display: flex;
          margin-bottom: 24px;
          position: relative;
        }
        .bk-steps::before {
          content: '';
          position: absolute;
          top: 15px;
          left: 10%;
          right: 10%;
          height: 2px;
          background: var(--light-gray);
          z-index: 0;
        }
        .bk-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 1;
        }
        .bk-step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--mid-gray);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          transition: all 0.3s;
        }
        .bk-step.active .bk-step-circle {
          background: var(--crimson);
          border-color: var(--crimson);
          color: #fff;
        }
        .bk-step.done .bk-step-circle {
          background: var(--success);
          border-color: var(--success);
          color: #fff;
        }
        .bk-step-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-muted);
          text-align: center;
        }
        .bk-step.active .bk-step-label { color: var(--crimson); }
        .bk-step.done .bk-step-label { color: var(--success); }

        .bk-form-group {
          margin-bottom: 14px;
        }
        .bk-form-label {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 4px;
        }
        .bk-form-input, .bk-form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1.5px solid var(--mid-gray);
          border-radius: 8px;
          font-size: 13px;
          color: var(--text-body);
          background: #fff;
          outline: none;
          box-sizing: border-box;
        }
        .bk-form-input:focus, .bk-form-select:focus {
          border-color: var(--crimson);
        }
        .bk-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .bk-form-hint {
          font-size: 10.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .bk-btn-row {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .bk-btn-next, .bk-btn-back, .bk-btn-submit {
          padding: 11px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .bk-btn-next {
          background: var(--crimson);
          color: #fff;
          flex: 1;
        }
        .bk-btn-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .bk-btn-back {
          background: var(--off-white);
          color: var(--text-body);
          border: 1.5px solid var(--mid-gray);
        }

        /* PAYMENT SECTION */
        .pay-methods {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        .pay-method {
          padding: 10px;
          border-radius: 8px;
          border: 1.5px solid var(--mid-gray);
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }
        .pay-method:hover { border-color: var(--crimson); }
        .pay-method.active { border-color: var(--crimson); background: rgba(139,0,0,.03); }
        .pay-method-icon { font-size: 1.5rem; margin-bottom: 2px; display: block; }
        .pay-method-label { font-size: 11px; font-weight: 700; }

        .card-preview {
          background: linear-gradient(135deg, #1f2937, #111827);
          border-radius: 12px;
          padding: 18px;
          color: #fff;
          margin-bottom: 14px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .card-preview::before {
          content: '';
          position: absolute;
          top: -20px;
          right: -20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
        }
        .card-chip {
          width: 32px;
          height: 24px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border-radius: 4px;
          margin-bottom: 12px;
        }
        .card-number {
          font-size: 15px;
          letter-spacing: 0.18em;
          font-weight: 700;
          margin-bottom: 12px;
          font-family: monospace;
        }
        .card-info-row {
          display: flex;
          justify-content: space-between;
        }
        .card-holder, .card-expiry {
          font-size: 9px;
          color: rgba(255,255,255,.5);
          text-transform: uppercase;
          letter-spacing: .06em;
        }
        .pay-card-fields {
          background: var(--off-white);
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 14px;
          border: 1px solid var(--mid-gray);
        }
        .pay-card-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        /* SUCCESS INVOICE */
        .bk-success {
          text-align: center;
          padding: 10px 0;
        }
        .bk-success-icon {
          animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes scaleIn { from{transform:scale(0.5);opacity:0;} to{transform:scale(1);opacity:1;} }
        .bk-ref-box {
          background: rgba(26,127,90,.03);
          border: 1.5px dashed rgba(26,127,90,.3);
          border-radius: 10px;
          padding: 14px 20px;
          margin: 18px 0;
        }
        .bk-ref-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--success);
          letter-spacing: 0.08em;
        }
        .bk-ref-num {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-dark);
          letter-spacing: 0.05em;
        }
        .bk-success-details {
          background: var(--off-white);
          border-radius: 10px;
          padding: 12px 16px;
          text-align: left;
          border: 1px solid var(--mid-gray);
        }
        .bk-success-details div {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid var(--light-gray);
          font-size: 12.5px;
        }
        .bk-success-details div:last-child {
          border-bottom: none;
        }

        /* RESPONSIVE LAYOUT OVERRIDES */
        @media(max-width: 1024px) {
          .booking-layout { grid-template-columns: 1fr; }
          .bk-hero-inner { grid-template-columns: 1fr; gap: 24px; }
          .bk-hero-gallery { display: none; }
          .facilities-grid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width: 768px) {
          .rooms-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
