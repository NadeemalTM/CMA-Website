import { useState, useEffect, useRef } from 'react';
import T from '../components/ui/T';
import {
  Calendar as CalendarIcon,
  Building2,
  User,
  Phone,
  Lock,
  Info,
  ShieldCheck,
  Snowflake,
  Bed,
  Users,
  Eye,
  Loader2,
  CheckCircle2,
  MapPin,
  Map,
  FileText,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkBookingStatus, getBookingAvailability, getBookingSettings, submitBooking, getBungalowRooms, getBungalowHeroImages, uploadBookingSupportingDocument, getStorageURL } from '../services/api';

// Room list loaded dynamically from backend API

const DEFAULT_HERO_IMAGES = {
  background: { image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1400&auto=format&fit=crop&q=70', alt_text: 'Kataragama natural landscape' },
  gallery_1: { image: 'https://media-cdn.tripadvisor.com/media/photo-s/02/e0/70/a5/gem-river-edge-eco-home.jpg', alt_text: 'Kataragama bungalow surroundings' },
  gallery_2: { image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=900&auto=format&fit=crop&q=75', alt_text: 'Bungalow living room' },
  gallery_3: { image: 'https://st5.depositphotos.com/19085394/64942/i/450/depositphotos_649426038-stock-photo-kirivehara-kiri-vehera-shrine-kataragama.jpg', alt_text: 'Kataragama Kiri Vehera Temple' },
};

export default function KataragamaBookingPage() {
  const { citizen } = useAuth();

  // Booking details state
  const [rooms, setRooms] = useState([]);
  const [roomAvailability, setRoomAvailability] = useState({});
  const [bookingSettings, setBookingSettings] = useState({ tax_rate: 18, reference_banner: null, reference_banner_alt: 'Kataragama booking information' });
  const [heroImages, setHeroImages] = useState(DEFAULT_HERO_IMAGES);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [currentRole, setCurrentRole] = useState('guest'); // guest or employee
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [checkinDateTime, setCheckinDateTime] = useState('');
  const [checkoutDateTime, setCheckoutDateTime] = useState('');
  const [selectedRooms, setSelectedRooms] = useState([]);

  const toggleRoomSelection = (room) => {
    if (selectedRangeIncludesBookedDate(room.id)) {
      window.alert(`${room.name} is already booked during the selected stay. Please choose another room or date.`);
      return;
    }
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
  const [, setLoadingAvailability] = useState(false);

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
  const [trackingReference, setTrackingReference] = useState(() => localStorage.getItem('ktgb_reference') || '');
  const [trackingPhone, setTrackingPhone] = useState(() => localStorage.getItem('ktgb_phone') || '');
  const [trackedBooking, setTrackedBooking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  // Legacy payment-screen state remains isolated from the new request flow;
  // Step 1 now submits directly for administrator review.
  const [payMethod, setPayMethod] = useState('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const otpInputsRef = useRef([]);

  // Fetch Availability from API
  const fetchAvailability = async () => {
    setLoadingAvailability(true);
    try {
      const res = await getBookingAvailability();
      if (res.data && res.data.status === 'success') {
        setAvailability(res.data.data);
        setRoomAvailability(res.data.rooms || {});
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

  const fetchHeroImages = async () => {
    try {
      const res = await getBungalowHeroImages();
      const images = res.data?.data || [];
      setHeroImages(images.reduce((slots, image) => ({ ...slots, [image.slot]: image }), {}));
    } catch (err) {
      console.error('Failed to fetch bungalow hero images:', err);
    }
  };

  const fetchBookingSettings = async () => {
    try {
      const res = await getBookingSettings();
      setBookingSettings(res.data?.data || bookingSettings);
    } catch (err) {
      console.error('Failed to fetch booking settings:', err);
    }
  };

  useEffect(() => {
    fetchAvailability();
    fetchRooms();
    fetchHeroImages();
    fetchBookingSettings();
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

  const getSstTotal = () => {
    if (selectedRooms.length === 0 || nights === 0) return 0;
    return selectedRooms.reduce((sum, r) => {
      const sstRate = Number(r.sst_rate !== undefined ? r.sst_rate : 2.25);
      return sum + Math.round(getRoomPrice(r) * nights * sstRate) / 100;
    }, 0);
  };

  const getVatTotal = () => {
    if (selectedRooms.length === 0 || nights === 0) return 0;
    return selectedRooms.reduce((sum, r) => {
      const priceTotal = getRoomPrice(r) * nights;
      const sstRate = Number(r.sst_rate !== undefined ? r.sst_rate : 2.25);
      const vatRate = Number(r.vat_rate !== undefined ? r.vat_rate : 18.00);
      const sstAmount = Math.round(priceTotal * sstRate) / 100;
      return sum + Math.round((priceTotal + sstAmount) * vatRate) / 100;
    }, 0);
  };

  const getTaxAmount = () => getSstTotal() + getVatTotal();

  const getAdditionalChargesTotal = () => {
    if (selectedRooms.length === 0 || nights === 0) return 0;
    return selectedRooms.reduce((sum, r) => sum + Number(r.additional_charge || 0), 0);
  };

  const getFinalTotal = () => getSubtotal() + getTaxAmount() + getAdditionalChargesTotal();

  const getConfirmedSst = () => {
    if (confirmedBooking?.room_details && Array.isArray(confirmedBooking.room_details)) {
      const sst = confirmedBooking.room_details.reduce((sum, r) => sum + Number(r.sst_amount || 0), 0);
      if (sst > 0) return sst;
    }
    return getSstTotal();
  };

  const getConfirmedVat = () => {
    if (confirmedBooking?.room_details && Array.isArray(confirmedBooking.room_details)) {
      const vat = confirmedBooking.room_details.reduce((sum, r) => sum + Number(r.vat_amount || 0), 0);
      if (vat > 0) return vat;
    }
    return getVatTotal();
  };

  const getConfirmedAdditionalCharges = () => {
    if (confirmedBooking?.room_details && Array.isArray(confirmedBooking.room_details)) {
      return confirmedBooking.room_details.reduce((sum, r) => sum + Number(r.additional_charge_total || r.additional_charge || 0), 0);
    }
    return getAdditionalChargesTotal();
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

  const selectedRangeIncludesBookedDate = (roomId) => {
    if (!checkinDate || !checkoutDate) return false;
    const cursor = new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate());
    const finalOccupiedDate = new Date(checkoutDate.getFullYear(), checkoutDate.getMonth(), checkoutDate.getDate());
    if (cursor.toDateString() !== finalOccupiedDate.toDateString()) {
      finalOccupiedDate.setDate(finalOccupiedDate.getDate() - 1);
    }

    while (cursor <= finalOccupiedDate) {
      const key = formatDateKey(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
      const status = roomId ? roomAvailability[roomId]?.[key] : availability[key];
      if (status === 'booked') return true;
      cursor.setDate(cursor.getDate() + 1);
    }
    return false;
  };

  // Proceed button click
  const handleProceed = () => {
    const unavailableRoom = selectedRooms.find(room => selectedRangeIncludesBookedDate(room.id));
    if (unavailableRoom) {
      window.alert(`${unavailableRoom.name} is already booked during the selected stay. Please review the room calendars.`);
      return;
    }
    setConfirmedBooking(null);
    setErrorMsg('');
    setCurrentStep(1);
    setModalOpen(true);
  };

  // Guesthouse specific form handlers
  const handleGovLetterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLetter(true);
    try {
      const res = await uploadBookingSupportingDocument(file);
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

  const handleOtpChange = (event, index) => {
    const value = event.target.value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otpCode];
    nextOtp[index] = value;
    setOtpCode(nextOtp);
    if (value && index < 5) otpInputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Submit booking directly without payment/OTP screens
  const handleDirectSubmit = async () => {
    setLoadingSubmit(true);
    setErrorMsg('');
    try {
      const payload = {
          guest_name: `${guestFirst} ${guestLast}`.trim(),
          email: guestEmail,
          phone: guestMobile,
          nic: guestNIC,
          employee_id: isCmaEmployee ? employeeId : null,
          room_ids: selectedRooms.map(room => room.id),
          check_in: checkinDateTime.replace('T', ' '),
          check_out: checkoutDateTime.replace('T', ' '),
          adults: Number(adults),
          children: Number(children),
          notes: specialRequests,
          permanent_address: permanentAddress,
          occupation: occupation,
          gov_letter: govLetter || null,
          is_cma_employee: Boolean(isCmaEmployee),
          family_count: Number(familyCount),
          family_members: familyMembers,
        };
      const response = await submitBooking(payload);
      if (response.data && response.data.status === 'success') {
        const booking = response.data.data;
        setConfirmedBooking({
          ...booking,
          booking_status: booking.status || 'Pending',
        });
        localStorage.setItem('ktgb_reference', booking.reference_no);
        localStorage.setItem('ktgb_phone', guestMobile);
        setTrackingReference(booking.reference_no);
        setTrackingPhone(guestMobile);
        setTrackedBooking({
          reference_no: booking.reference_no,
          booking_status: 'Pending',
          payment_status: 'Pending',
          message: 'Payment and administrator approval are pending.',
        });
        setCurrentStep(5);
        fetchAvailability();
      }
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'An error occurred during booking. Please try again.'
      );
      setCurrentStep(1);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleStatusCheck = async () => {
    if (!trackingReference || !trackingPhone) {
      setTrackingError('Enter your booking reference number and phone number.');
      return;
    }

    setTrackingLoading(true);
    setTrackingError('');
    try {
      const response = await checkBookingStatus(trackingReference.trim().toUpperCase(), trackingPhone.trim());
      setTrackedBooking(response.data.data);
      setConfirmedBooking((current) => current ? { ...current, ...response.data.data } : current);
      localStorage.setItem('ktgb_reference', trackingReference.trim().toUpperCase());
      localStorage.setItem('ktgb_phone', trackingPhone.trim());
      if (response.data.data?.booking_status === 'Confirmed') {
        fetchAvailability();
      }
    } catch (error) {
      setTrackedBooking(null);
      setTrackingError(error?.response?.data?.message || 'Unable to check this booking right now.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCardNumberChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim());
  };

  const handleCardExpiryChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
    setCardExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  };

  const handleVerifyOtpSubmit = () => handleDirectSubmit();

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
      const checkinTime = new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate()).getTime();
      const checkoutTime = new Date(checkoutDate.getFullYear(), checkoutDate.getMonth(), checkoutDate.getDate()).getTime();
      const thisTime = thisDate.getTime();

      if (thisTime === checkinTime) isSelected = true;
      else if (thisTime === checkoutTime) isCheckoutDay = true;
      else if (thisTime > checkinTime && thisTime < checkoutTime) isInRange = true;
    } else if (checkinDate && checkinDate.toDateString() === thisDate.toDateString()) {
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
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* ── Hero Section ── */}
      <section className="bk-hero">
        <div className="bk-hero-bg" style={heroImages.background?.image ? { backgroundImage: `url("${heroImages.background.image}")` } : undefined} />
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
            <p className="bk-hero-desc"><T>
              Reserve your stay at the Condominium Management Authority's exclusive circuit bungalow — nestled in the heart of Kataragama, offering tranquil accommodation for staff and visiting guests.
            </T></p>
          </div>
          <div className="bk-hero-gallery">
            {['gallery_1', 'gallery_2', 'gallery_3'].map((slot) => heroImages[slot]?.image && (
              <div className="bk-gallery-img" key={slot}>
                <img src={heroImages[slot].image} alt={heroImages[slot].alt_text || 'Kataragama bungalow'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Selector ── */}
      <div className="role-selector-sec">
        <div className="role-selector-inner">
          <div className="role-row">
            <span className="role-label"><T>I am a:</T></span>
            <button
              className={`role-btn${currentRole === 'guest' ? ' active' : ''}`}
              onClick={() => {
                setCurrentRole('guest');
                setIsCmaEmployee(false);
                setSelectedRooms([]);
              }}
            >
              <User size={14} />
              Visiting Guest
              <span className="role-badge"><T>Public</T></span>
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

              <div className="bk-availability-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                
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
                      <strong><T>Bungalow Stay Policy:</T></strong> Check-in is fixed at <strong><T>1:00 PM</T></strong> on the arrival date, and check-out is fixed at <strong><T>10:00 AM</T></strong> on the departure date. This stay period is automatically calculated as one day.
                    </div>
                  </div>

                  <div className="bk-dates-input-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label htmlFor="checkin-date" style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)', marginBottom: '8px' }}>
                        Check-in Date *
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          id="checkin-date"
                          name="checkin-date"
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
                        }}><T>
                          1:00 PM
                        </T></span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="checkout-date" style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: 'var(--text-dark)', marginBottom: '8px' }}>
                        Check-out Date *
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          id="checkout-date"
                          name="checkout-date"
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
                        }}><T>
                          10:00 AM
                        </T></span>
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
                        <span><T>Staying Duration:</T></span>
                        <strong>{nights} Day(s)</strong>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}><T>
                        (Calculated automatically)
                      </T></span>
                    </div>
                  )}
                </div>

                {/* Right Column: Compact Availability Calendar */}
                <div style={{ borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-dark)' }}><T>
                      Availability Calendar
                    </T></span>
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
                      <span><T>S</T></span><span><T>M</T></span><span><T>T</T></span><span><T>W</T></span><span><T>T</T></span><span><T>F</T></span><span><T>S</T></span>
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
                <div>
                  <h3 style={{ margin: 0 }}><T>Select One or More Rooms</T></h3>
                  <p style={{ margin: '5px 0 0', color: 'var(--text-muted)', fontSize: '12.5px' }}>Each calendar shows that room's own confirmed reservations.</p>
                </div>
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
                    const sstRate = Number(room.sst_rate !== undefined ? room.sst_rate : 2.25);
                    const vatRate = Number(room.vat_rate !== undefined ? room.vat_rate : 18.00);
                    const roomSst = Math.round(price * sstRate) / 100;
                    const roomVat = Math.round((price + roomSst) * vatRate) / 100;
                    const roomTax = roomSst + roomVat;
                    const roomFinal = price + roomTax;
                    const isUnavailable = selectedRangeIncludesBookedDate(room.id);

                    return (
                      <div
                        key={room.id}
                        className={`room-card${isSelected ? ' selected-room' : ''}${isUnavailable ? ' room-unavailable' : ''}`}
                        onClick={() => !isUnavailable && toggleRoomSelection(room)}
                      >
                        {room.image ? (
                          <img
                            src={room.image.startsWith('http') ? room.image : getStorageURL(room.image)}
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
                          <div className="room-mini-calendar" onClick={e => e.stopPropagation()}>
                            <div className="room-mini-calendar-title">Availability — {monthName}</div>
                            <div className="room-mini-calendar-grid room-mini-calendar-weekdays">
                              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
                            </div>
                            <div className="room-mini-calendar-grid">
                              {calendarDays.map((calendarDay, index) => {
                                if (calendarDay.empty) return <span key={`empty-${index}`} className="room-mini-day empty" />;
                                const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), calendarDay.day);
                                const status = roomAvailability[room.id]?.[dateKey] || 'available';
                                return (
                                  <span
                                    key={dateKey}
                                    className={`room-mini-day ${status}`}
                                    title={`${room.name}: ${status === 'booked' ? 'Booked' : 'Available'} on ${dateKey}`}
                                  >
                                    {calendarDay.day}
                                  </span>
                                );
                              })}
                            </div>
                            <div className="room-mini-legend"><span><i className="available" /> Available</span><span><i className="booked" /> Booked</span></div>
                          </div>
                          <div className="room-price-breakdown">
                            <div><span>Booking Price</span><strong>Rs. {Number(price).toLocaleString()}</strong></div>
                            <div><span>SST ({sstRate}%)</span><strong>Rs. {roomSst.toLocaleString()}</strong></div>
                            <div><span>VAT ({vatRate}%)</span><strong>Rs. {roomVat.toLocaleString()}</strong></div>
                            {Number(room.additional_charge || 0) > 0 && (
                              <div><span>{room.additional_charge_label || 'Additional Charge'} (One-time)</span><strong>Rs. {Number(room.additional_charge).toLocaleString()}</strong></div>
                            )}
                            <div className="room-final-price"><span>Rate (Inc. Tax)</span><strong>Rs. {roomFinal.toLocaleString()} / night</strong></div>
                          </div>
                          <button
                            className="room-select-btn"
                            type="button"
                            disabled={isUnavailable}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRoomSelection(room);
                            }}
                          >
                            {isUnavailable ? 'Unavailable for selected dates' : isSelected ? '✓ Selected' : 'Add Room'}
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
                <h4 style={{ margin: 0 }}><T>Booking Summary</T></h4>
                <p style={{ margin: '4px 0 0', fontSize: '11.5px', opacity: 0.85 }}><T>Review your reservation</T></p>
              </div>
              <div className="bk-sum-body">
                <div className="bk-sum-row">
                  <span className="bk-sum-label"><T>Property</T></span>
                  <span className="bk-sum-value"><T>Kataragama Bungalow</T></span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label"><T>Room(s)</T></span>
                  <span className="bk-sum-value">{selectedRooms.length > 0 ? selectedRooms.map(r => r.name).join(', ') : 'Not selected'}</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label"><T>Check-In</T></span>
                  <span className="bk-sum-value">{formatDateLabel(checkinDate)}</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label"><T>Check-Out</T></span>
                  <span className="bk-sum-value">{formatDateLabel(checkoutDate)}</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label"><T>Nights</T></span>
                  <span className="bk-sum-value">{nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : '—'}</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label"><T>Guests</T></span>
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
                
                <div className="bk-sum-row">
                  <span className="bk-sum-label"><T>Booking Price</T></span>
                  <span className="bk-sum-value">Rs. {getSubtotal().toLocaleString()}</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label">SST Tax</span>
                  <span className="bk-sum-value">Rs. {getSstTotal().toLocaleString()}</span>
                </div>
                <div className="bk-sum-row">
                  <span className="bk-sum-label">VAT Tax</span>
                  <span className="bk-sum-value">Rs. {getVatTotal().toLocaleString()}</span>
                </div>
                {getAdditionalChargesTotal() > 0 && (
                  <div className="bk-sum-row">
                    <span className="bk-sum-label">Additional Charges (One-time)</span>
                    <span className="bk-sum-value">Rs. {getAdditionalChargesTotal().toLocaleString()}</span>
                  </div>
                )}
                <div className="bk-sum-total">
                  <span className="bk-sum-total-label"><T>Final Price</T></span>
                  <span className="bk-sum-total-val">Rs. {getFinalTotal().toLocaleString()}</span>
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
                  <div className="bk-trust-item"><User size={14} style={{ color: 'var(--success)' }} /> No account or sign-in required</div>
                  <div className="bk-trust-item"><ShieldCheck size={14} style={{ color: 'var(--success)' }} /> Secure SSL Booking</div>
                  <div className="bk-trust-item"><ShieldCheck size={14} style={{ color: 'var(--success)' }} /> Free Cancellation 48hrs prior</div>
                  <div className="bk-trust-item"><ShieldCheck size={14} style={{ color: 'var(--success)' }} /> Admin-reviewed reservation</div>
                </div>
              </div>
            </div>

            {/* Public booking status tracker */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '20px', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dark)', marginBottom: '6px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--crimson)' }} />
                Check Booking Status
              </div>
              <p style={{ margin: '0 0 12px', color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.5 }}>
                Enter the reference and phone number used for your request.
              </p>
              <input
                className="bk-form-input"
                placeholder="KTGB008723"
                value={trackingReference}
                onChange={(event) => setTrackingReference(event.target.value.toUpperCase())}
                style={{ marginBottom: '8px' }}
              />
              <input
                className="bk-form-input"
                placeholder="Phone number"
                value={trackingPhone}
                onChange={(event) => setTrackingPhone(event.target.value)}
                style={{ marginBottom: '8px' }}
              />
              <button type="button" className="bk-proceed-btn" onClick={handleStatusCheck} disabled={trackingLoading}>
                {trackingLoading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Eye size={15} />}
                Check Status
              </button>
              {trackingError && <div style={{ marginTop: '10px', color: '#b91c1c', fontSize: '12px' }}>{trackingError}</div>}
              {trackedBooking && (
                <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', background: trackedBooking.booking_status === 'Confirmed' ? '#ecfdf5' : trackedBooking.booking_status === 'Cancelled' ? '#fef2f2' : '#fffbeb', border: '1px solid #e5e7eb', fontSize: '12px', lineHeight: 1.6 }}>
                  <strong style={{ display: 'block', color: trackedBooking.booking_status === 'Confirmed' ? '#15803d' : trackedBooking.booking_status === 'Cancelled' ? '#b91c1c' : '#b45309' }}>
                    {trackedBooking.booking_status === 'Confirmed' ? 'Booking Successful' : trackedBooking.booking_status === 'Cancelled' ? 'Booking Not Approved' : 'Pending Approval'}
                  </strong>
                  <div>Reference: <b>{trackedBooking.reference_no}</b></div>
                  {trackedBooking.unit_number && <div>Room(s): <b>{trackedBooking.unit_number}</b></div>}
                  {trackedBooking.check_in && <div>Stay: <b>{trackedBooking.check_in}</b> to <b>{trackedBooking.check_out}</b></div>}
                  {trackedBooking.amount !== undefined && <div>Final Price: <b>Rs. {Number(trackedBooking.amount).toLocaleString()}</b> (includes Rs. {Number(trackedBooking.tax_amount || 0).toLocaleString()} tax)</div>}
                  <div>Payment: <b>{trackedBooking.payment_status}</b></div>
                  <div>{trackedBooking.message}</div>

                  {bookingSettings.payment_guideline_pdf && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', textAlign: 'center' }}>
                      <a
                        href={getStorageURL(bookingSettings.payment_guideline_pdf)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '11.5px', fontWeight: 600, textDecoration: 'none' }}
                      >
                        <Download size={13} /> {bookingSettings.payment_guideline_title || 'Download Payment Guidelines (PDF)'}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Need Help card */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dark)', marginBottom: '12px' }}>
                <Phone size={14} style={{ color: 'var(--crimson)' }} />
                Need Booking Assistance?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <div>📞 0112447432</div>
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
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}><T>
                Detour Road, Kataragama, Sri Lanka. Conveniently situated close to the sacred temples.
              </T></p>
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
            <span className="section-label"><T>Amenities</T></span>
            <h2 className="section-title"><T>Bungalow Facilities</T></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}><T>
              Enjoy standard facilities at the CMA Circuit Bungalow — designed for a comfortable retreat.
            </T></p>
          </div>
          <div className="facilities-grid">
            <div className="facility-card">
              <span className="facility-icon">🛏️</span>
              <h4 className="facility-name"><T>Comfortable Rooms</T></h4>
              <p className="facility-desc"><T>Quality beds, linen, hot water showers, and optional AC setups.</T></p>
            </div>
            <div className="facility-card">
              <span className="facility-icon">🍽️</span>
              <h4 className="facility-name"><T>Dining Hall</T></h4>
              <p className="facility-desc"><T>Spacious seating with kitchen setups available for visiting guests.</T></p>
            </div>
            <div className="facility-card">
              <span className="facility-icon">🌿</span>
              <h4 className="facility-name"><T>Surrounding Gardens</T></h4>
              <p className="facility-desc"><T>Beautiful lush courtyard garden surrounding the premises.</T></p>
            </div>
            <div className="facility-card">
              <span className="facility-icon">🅿️</span>
              <h4 className="facility-name"><T>Free Vehicle Parking</T></h4>
              <p className="facility-desc"><T>On-site secure parking space inside the gated boundaries.</T></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Multi-Step Checkout Modal ── */}
      {modalOpen && (
        <div className="bk-modal-overlay open">
          <div className="bk-modal">
            <div className="bk-modal-head">
              <span className="bk-modal-title"><T>Complete Reservation</T></span>
              <button className="bk-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="bk-modal-body">
              
              {/* Stepper Header */}
              <div className="bk-steps" style={{ justifyContent: 'center', gap: '40px' }}>
                <div className={`bk-step${currentStep >= 1 ? ' active' : ''}${currentStep > 1 ? ' done' : ''}`}>
                  <div className="bk-step-circle">1</div>
                  <div className="bk-step-label">Guest Info</div>
                </div>
                <div className={`bk-step${currentStep === 5 ? ' active' : ''}`}>
                  <div className="bk-step-circle">✓</div>
                  <div className="bk-step-label">Done</div>
                </div>
              </div>

              {errorMsg && (
                <div style={{ margin: '0 0 16px', padding: '10px 12px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '12.5px', fontWeight: 600 }}>
                  {errorMsg}
                </div>
              )}

              {/* Step 1: Guest Info */}
              {currentStep === 1 && (
                <div className="bk-form-section active">
                  <h4 style={{ margin: '0 0 16px', fontWeight: 700 }}><T>Guest Information</T></h4>
                  
                  {/* Period of stay times notice (timings 2.00pm / 10.00am) */}
                  <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>⏰</span>
                    <span>
                      <strong><T> stay period limits:</T></strong> check-in starts at <strong><T>2:00 p.m.</T></strong>, check-out is strictly before <strong><T>10:00 a.m.</T></strong>
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
                      <input
                        type="checkbox"
                        id="isCmaEmpCheckbox"
                        checked={isCmaEmployee}
                        onChange={e => {
                          const checked = e.target.checked;
                          setIsCmaEmployee(checked);
                          setCurrentRole(checked ? 'employee' : 'guest');
                          setSelectedRooms([]);
                        }}
                        style={{ width: '18px', height: '18px', marginRight: '8px', cursor: 'pointer' }}
                      />
                      <label htmlFor="isCmaEmpCheckbox" style={{ fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Employed at Ministry / CMA?</label>
                    </div>
                  </div>

                  {/* Gov Institution official letter upload */}
                  <div style={{ background: '#fafafa', border: '1px dashed var(--mid-gray)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                    <label className="bk-form-label" style={{ margin: 0, fontWeight: 700, fontSize: '13px' }}>Government Institution Employee? (Optional)</label>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '8px', lineHeight: 1.4 }}><T>
                      If employed in a government institution, please attach an official letter confirming employment.
                    </T></span>
                    <input type="file" accept=".pdf,image/*" onChange={handleGovLetterUpload} style={{ display: 'block', fontSize: '12px', width: '100%' }} />
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '5px' }}>No account or sign-in is required. PDF and image files up to 10 MB are accepted.</div>
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
                  <div style={{ border: '1.5px solid var(--mid-gray)', borderRadius: '10px', padding: '16px', marginBottom: '16px', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <label className="bk-form-label" style={{ margin: 0, fontWeight: 700, fontSize: '13px' }}>Accompanying Family Members ({familyCount})</label>
                      <button type="button" onClick={addFamilyMember} style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--light-gray)', border: '1px solid var(--mid-gray)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Add Accompanying Member</button>
                    </div>
                    
                    {familyMembers.length === 0 ? (
                      <div style={{ fontSize: '12px', color: '#64748b', padding: '10px', textAlign: 'center', background: 'var(--off-white)', borderRadius: '6px' }}>
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
                      disabled={!guestFirst || !guestLast || !guestNIC || !guestMobile || !guestEmail || !permanentAddress || !occupation || (currentRole === 'employee' && !employeeId) || loadingSubmit}
                      onClick={handleDirectSubmit}
                    >
                      {loadingSubmit ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', marginRight: '6px' }} /> : null}
                      Proceed to Book
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Review */}
              {currentStep === 2 && (
                <div className="bk-form-section active">
                  <h4 style={{ margin: '0 0 16px', fontWeight: 700 }}><T>Review Details</T></h4>
                  <div style={{ background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}><T>Guest Name</T></span>
                      <strong style={{ color: 'var(--text-dark)' }}>{guestFirst} {guestLast}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}><T>NIC Number</T></span>
                      <strong>{guestNIC}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}><T>Contact Details</T></span>
                      <strong>{guestMobile} | {guestEmail}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}><T>Permanent Address</T></span>
                      <strong style={{ maxWidth: '240px', textAlign: 'right', whiteSpace: 'pre-wrap' }}>{permanentAddress}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}><T>Occupation</T></span>
                      <strong>{occupation}</strong>
                    </div>
                    {isCmaEmployee && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                        <span style={{ color: 'var(--text-muted)' }}><T>Ministry / CMA Staff</T></span>
                        <strong style={{ color: '#16a34a' }}><T>Yes</T></strong>
                      </div>
                    )}
                    {govLetter && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                        <span style={{ color: 'var(--text-muted)' }}><T>Official Gov Letter</T></span>
                        <strong style={{ color: '#16a34a' }}><T>Attached</T></strong>
                      </div>
                    )}
                    {familyMembers.length > 0 && (
                      <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', fontSize: '12.5px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Accompanying Members ({familyCount}):</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--off-white)', padding: '8px', borderRadius: '6px' }}>
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
                      <span style={{ color: 'var(--text-muted)' }}><T>Room(s) Selection</T></span>
                      <strong style={{ color: 'var(--crimson)' }}>{selectedRooms.map(r => r.name).join(', ')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}><T>Check-In</T></span>
                      <strong>{formatDateLabel(checkinDate)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}><T>Check-Out</T></span>
                      <strong>{formatDateLabel(checkoutDate)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}><T>Nights</T></span>
                      <strong>{nights} night{nights > 1 ? 's' : ''}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}><T>Booking Price</T></span>
                      <strong>Rs. {getSubtotal().toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>SST Tax</span>
                      <strong>Rs. {getSstTotal().toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>VAT Tax</span>
                      <strong>Rs. {getVatTotal().toLocaleString()}</strong>
                    </div>
                    {getAdditionalChargesTotal() > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Additional Charges (One-time)</span>
                        <strong>Rs. {getAdditionalChargesTotal().toLocaleString()}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}><T>Final Price</T></span>
                      <strong style={{ fontSize: '16px', color: 'var(--crimson)' }}>Rs. {getFinalTotal().toLocaleString()}</strong>
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
                  <h4 style={{ margin: '0 0 16px', fontWeight: 700 }}><T>Secure Payment Simulation</T></h4>
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
                    <h3 className="otp-heading" style={{ margin: 0 }}><T>OTP Verification</T></h3>
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
                      <strong><T>Demo Simulation:</T></strong> Enter <strong style={{ color: 'var(--crimson)' }}><T>1 2 3 4 5 6</T></strong> to verify transaction successfully.
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
                    <div className="bk-success-icon" style={{ fontSize: '3.5rem' }}>{confirmedBooking.booking_status === 'Confirmed' ? '✅' : '⏳'}</div>
                    <h3 className="bk-success-title" style={{ margin: '10px 0 0' }}>
                      {confirmedBooking.booking_status === 'Confirmed' ? 'Booking Successful!' : 'Booking Request Submitted'}
                    </h3>
                    <p className="bk-success-sub" style={{ marginTop: '8px', fontWeight: '600', color: confirmedBooking.booking_status === 'Confirmed' ? '#15803d' : '#b45309' }}>
                      {confirmedBooking.booking_status === 'Confirmed'
                        ? 'Your reservation has been approved. The selected dates are now secured.'
                        : 'Payment is pending and your request is awaiting administrator approval. No payment has been collected online.'}
                    </p>
                    
                    {bookingSettings.reference_banner && (
                      <div style={{ margin: '15px 0 10px' }}>
                        <img
                          src={getStorageURL(bookingSettings.reference_banner)}
                          alt={bookingSettings.reference_banner_alt || 'Kataragama booking information'}
                          style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #eee' }}
                        />
                      </div>
                    )}

                    <div className="bk-ref-box">
                      <div className="bk-ref-label">Booking Reference Number</div>
                      <div className="bk-ref-num">
                        {confirmedBooking.allReferences 
                          ? confirmedBooking.allReferences 
                          : confirmedBooking.reference_no}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
                      <div style={{ padding: '10px', borderRadius: '8px', background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', fontSize: '12px' }}>
                        Payment: <strong>{confirmedBooking.payment_status || 'Pending'}</strong>
                      </div>
                      <div style={{ padding: '10px', borderRadius: '8px', background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', fontSize: '12px' }}>
                        Approval: <strong>{confirmedBooking.booking_status || 'Pending'}</strong>
                      </div>
                    </div>

                    <div className="bk-success-details">
                      <div>
                        <strong><T>Room Type:</T></strong>
                        <span>{confirmedBooking.unit_number}</span>
                      </div>
                      <div>
                        <strong><T>Check-In Date:</T></strong>
                        <span>{confirmedBooking.check_in ? String(confirmedBooking.check_in).substring(0, 10) : ''}</span>
                      </div>
                      <div>
                        <strong><T>Check-Out Date:</T></strong>
                        <span>{confirmedBooking.check_out ? String(confirmedBooking.check_out).substring(0, 10) : ''}</span>
                      </div>
                      <div>
                        <strong><T>Booking Price:</T></strong>
                        <span>Rs. {Number(confirmedBooking.subtotal ?? getSubtotal()).toLocaleString()}</span>
                      </div>
                      <div>
                        <strong>SST Tax:</strong>
                        <span>Rs. {getConfirmedSst().toLocaleString()}</span>
                      </div>
                      <div>
                        <strong>VAT Tax:</strong>
                        <span>Rs. {getConfirmedVat().toLocaleString()}</span>
                      </div>
                      {getConfirmedAdditionalCharges() > 0 && (
                        <div>
                          <strong>Additional Charges (One-time):</strong>
                          <span>Rs. {getConfirmedAdditionalCharges().toLocaleString()}</span>
                        </div>
                      )}
                      <div>
                        <strong><T>Final Amount:</T></strong>
                        <span style={{ color: 'var(--success)', fontWeight: 700 }}>Rs. {Number(confirmedBooking.amount).toLocaleString()}</span>
                      </div>
                    </div>

                    {bookingSettings.payment_guideline_pdf && (
                      <div style={{ marginTop: '18px', padding: '14px', borderRadius: '10px', background: '#f0f9ff', border: '1px solid #bae6fd', textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#0369a1', fontSize: '13px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <FileText size={16} />
                          {bookingSettings.payment_guideline_title || 'Payment Guidelines & Bank Instructions'}
                        </div>
                        <a
                          href={getStorageURL(bookingSettings.payment_guideline_pdf)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '12.5px', fontWeight: 600, textDecoration: 'none' }}
                        >
                          <Download size={14} /> Download Payment Guidelines (PDF)
                        </a>
                      </div>
                    )}

                    <div style={{ display: 'flex', marginTop: '24px', justifyContent: 'center' }}>
                      <button
                        className="btn btn-outline"
                        style={{ borderRadius: '8px', padding: '10px 20px', fontSize: '13px', marginRight: '8px' }}
                        onClick={handleStatusCheck}
                        disabled={trackingLoading}
                      >
                        Refresh Status
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
                        Close
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
          background-color: #26140f;
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
        .room-card.room-unavailable {
          border-color: #fecaca;
          cursor: not-allowed;
        }
        .room-card.room-unavailable:hover {
          transform: none;
          box-shadow: var(--shadow-sm);
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
        .room-mini-calendar { margin-top: 10px; border: 1px solid #eee; border-radius: 8px; padding: 9px; background: #fafafa; }
        .room-mini-calendar-title { font-size: 11.5px; font-weight: 700; color: var(--text-dark); margin-bottom: 7px; }
        .room-mini-calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
        .room-mini-calendar-weekdays { margin-bottom: 3px; text-align: center; font-size: 9px; font-weight: 700; color: #64748b; }
        .room-mini-day { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border-radius: 3px; font-size: 9px; background: #dcfce7; color: #166534; }
        .room-mini-day.booked { background: #dc2626; color: #fff; font-weight: 700; }
        .room-mini-day.empty { background: transparent; }
        .room-mini-legend { display: flex; gap: 12px; margin-top: 7px; font-size: 9.5px; color: #64748b; }
        .room-mini-legend span { display: flex; align-items: center; gap: 4px; }
        .room-mini-legend i { width: 7px; height: 7px; border-radius: 2px; background: #dcfce7; }
        .room-mini-legend i.booked { background: #dc2626; }
        .room-price-breakdown { margin-top: auto; padding-top: 13px; display: grid; gap: 5px; font-size: 11.5px; }
        .room-price-breakdown > div { display: flex; justify-content: space-between; gap: 8px; }
        .room-price-breakdown span { color: var(--text-muted); }
        .room-final-price { border-top: 1px solid #eee; padding-top: 7px; color: var(--crimson); }
        .room-final-price strong { font-size: 13px; }
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
        .room-select-btn:disabled, .room-select-btn:disabled:hover {
          border-color: #ef4444;
          background: #fef2f2;
          color: #b91c1c;
          cursor: not-allowed;
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
        @media(max-width: 900px) {
          .bk-availability-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
        @media(max-width: 768px) {
          .rooms-grid { grid-template-columns: 1fr; }
          .facilities-grid { grid-template-columns: 1fr 1fr; }
          .booking-layout { gap: 20px; }
        }
        @media(max-width: 600px) {
          .bk-form-row { grid-template-columns: 1fr !important; gap: 12px !important; }
          .pay-methods { grid-template-columns: 1fr !important; }
        }
        @media(max-width: 640px) {
          .facilities-grid { grid-template-columns: 1fr; }
          .bk-date-row { flex-direction: column !important; gap: 12px !important; }
          .bk-guest-row { flex-direction: column !important; gap: 12px !important; }
          .bk-step-row { flex-direction: column !important; gap: 12px !important; }
          .bk-pay-row { flex-direction: column !important; gap: 10px !important; }
          .bk-confirm-actions { flex-direction: column !important; gap: 12px !important; }
          .bk-confirm-actions a, .bk-confirm-actions button { width: 100% !important; text-align: center !important; justify-content: center !important; }
          .bk-summary-grid { grid-template-columns: 1fr !important; }
          .bk-otp-row { gap: 8px !important; }
          .bk-modal-inner { padding: 24px 16px !important; border-radius: 16px !important; margin: 12px !important; }
        }
        @media(max-width: 480px) {
          .bk-hero { padding: 48px 16px 40px !important; }
          .bk-hero h1 { font-size: clamp(1.5rem, 6vw, 2.5rem) !important; }
          .bk-section-inner { padding: 20px 16px !important; }
          .bk-room-card { padding: 16px !important; }
          .bk-calendar-header { flex-direction: column !important; gap: 8px !important; align-items: flex-start !important; }
          .bk-amenity-tag { font-size: 11px !important; padding: 4px 8px !important; }
          .bk-dates-input-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
}
