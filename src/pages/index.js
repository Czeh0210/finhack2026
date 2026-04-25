import { useState } from "react";
import Head from "next/head";
import styles from "@/styles/tngpage.module.css";
import { startTransaction } from "@/services/transactionService";

// Format phone like +60 13-788 2945
function formatPhone(num) {
  const digits = num.replace(/[^0-9]/g, "");
  if (digits.length <= 2) return `+60 ${digits}`;
  if (digits.length <= 5) return `+60 ${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `+60 ${digits.slice(0, 2)}-${digits.slice(2, 5)} ${digits.slice(5)}`;
}

export default function TngPage() {
  const [screen, setScreen] = useState("home"); // home | transfer | transferMoney
  const [showPennyPopup, setShowPennyPopup] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [resolvedName, setResolvedName] = useState("");
  const [amountValue, setAmountValue] = useState("");
  const [transferLimit, setTransferLimit] = useState("600");
  const [limitInput, setLimitInput] = useState("600");
  const [showLimitError, setShowLimitError] = useState(false);

  // Transaction verification state
  const [txStatus, setTxStatus] = useState(null); // null | "SAFE" | "AI_CALL_TRIGGERED" | "SUCCESS" | "ERROR"
  const [txId, setTxId] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txError, setTxError] = useState(null);

  const isPhoneValid = phoneInput.replace(/[^0-9]/g, "").length >= 9;

  const handleTransferClick = () => {
    setScreen("transfer");
  };

  const handleBack = () => {
    if (screen === "transferMoney") {
      setScreen("transfer");
      setResolvedName("");
      setAmountValue("");
      setShowLimitError(false);
    } else if (screen === "transfer" || screen === "safetyLimit") {
      setScreen("home");
      setPhoneInput("");
      setResolvedName("");
      setAmountValue("");
      setShowLimitError(false);
    }
  };

  const handleNextClick = () => {
    if (isPhoneValid) {
      setResolvedName("David");
      setScreen("transferMoney");
    }
  };

  const handleClearPhone = () => {
    setPhoneInput("");
  };

  const recentContacts = [
    { name: "Ong Kang Yan", phone: "+60 17-716 3313" },
    { name: "Yin Ee Heng", phone: "+60 12-733 1262" },
    { name: "OOI YEONG MOOI", phone: "+60 12-456 7890" },
    { name: "Hu Qi Jin", phone: "+60 13-369 6810" },
  ];

  // ==================== SCREEN 1: HOME ====================
  if (screen === "home") {
    return (
      <>
        <Head>
          <title>Touch &apos;n Go eWallet</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <div className={styles.phone}>
          {/* Status Bar */}
          <div className={styles.statusBar}>
            <span className={styles.time}>8:31</span>
            <div className={styles.statusIcons}>
              <span className={styles.signal}>&#9679;&#9679;&#9679;&#9679;</span>
              <span className={styles.wifi}>5G</span>
              <span className={styles.battery}>🔋</span>
            </div>
          </div>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <div className={styles.promoBadge}>Enjoy 40% 🎉</div>
              <div className={styles.searchBar}>
                <span className={styles.searchIcon}>🔍</span>
                <span>BUDI95</span>
              </div>
              <div className={styles.profileIcon}>👤</div>
            </div>

            <div className={styles.balanceSection}>
              <div className={styles.balanceRow}>
                <span className={styles.walletIcon}>💰</span>
                <span className={styles.balanceAmount}>RM 7889.53</span>
                <span className={styles.eyeIcon}>👁</span>
              </div>
              <div className={styles.balanceLink}>View balance details &gt;</div>
              <div className={styles.balanceActions}>
                <button className={styles.addMoneyBtn}>+ Add money</button>
                <button className={styles.transactionsBtn}>Transactions &gt;</button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <div className={styles.actionItem}>
              <div className={styles.actionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#005abb" strokeWidth="2" width="28" height="28">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 10h18" />
                </svg>
              </div>
              <span>Apply</span>
            </div>
            <div className={styles.actionItem} onClick={() => { setLimitInput(transferLimit); setScreen("safetyLimit"); }} style={{ cursor: "pointer" }}>
              <div className={styles.actionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#005abb" strokeWidth="2" width="28" height="28">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <span>Safety Limit</span>
            </div>
            <div className={styles.actionItem} onClick={handleTransferClick} style={{ cursor: "pointer" }}>
              <div className={styles.actionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#005abb" strokeWidth="2" width="28" height="28">
                  <path d="M5 12l14-7-7 14-2-5z" />
                </svg>
              </div>
              <span>Transfer</span>
            </div>
            <div className={styles.actionItem}>
              <div className={styles.actionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#005abb" strokeWidth="2" width="28" height="28">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </div>
              <span>Cards</span>
            </div>
          </div>

          {/* Info Cards */}
          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🌱</div>
              <div>
                <div className={styles.infoCardTitle}>Grow your money</div>
                <div className={styles.infoCardSub}>Start with just RM10</div>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>⛽</div>
              <div>
                <div className={styles.infoCardTitle}>BUDI95</div>
                <div className={styles.infoCardSub}>RON95 at RM1.99</div>
              </div>
            </div>
          </div>

          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🎁</div>
              <div>
                <div className={styles.infoCardTitle}>GOrewards</div>
                <div className={styles.infoCardSubOrange}>Expiring: 719 pts</div>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>⛽</div>
              <div>
                <div className={styles.infoCardTitle}>Fuel balance</div>
                <div className={styles.infoCardSub}>200 litres</div>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div className={styles.banner}>
            <div className={styles.bannerContent}>
              <div className={styles.bannerTag}>
                <span className={styles.bannerInfo}>Info</span>
                <span className={styles.bannerRemittance}>Remittance</span>
              </div>
              <div className={styles.bannerText}>
                Get <span style={{ color: "#FFD700", fontWeight: 700 }}>RM5</span> when you<br />
                <span style={{ color: "#FFD700", fontWeight: 700 }}>refer family & friends</span><br />
                to use Remittance
              </div>
              <div className={styles.bannerLink}>Find out more</div>
            </div>
          </div>

          {/* Recommended */}
          <div className={styles.recommended}>
            <h3>Recommended</h3>
            <div className={styles.recommendedIcons}>
              <div className={styles.recommendedItem}>
                <div className={styles.recommendedIcon}>📅</div>
                <span>Payday</span>
              </div>
              <div className={styles.recommendedItem}>
                <div className={styles.recommendedIcon}>✈️</div>
                <span>Travel</span>
              </div>
              <div className={styles.recommendedItem}>
                <div className={styles.recommendedIcon}>🛍️</div>
                <span>Taobao</span>
              </div>
            </div>
          </div>

          {/* My Favourites */}
          <div className={styles.favourites}>
            <span className={styles.favTitle}>My Favourites</span>
            <span className={styles.favEdit}>Edit</span>
          </div>

          {/* Bottom Nav */}
          <div className={styles.bottomNav}>
            <div className={`${styles.navItem} ${styles.navActive}`}>
              <span className={styles.navIcon}>🏠</span>
              <span>Home</span>
            </div>
            <div className={styles.navItem}>
              <span className={styles.navIcon}>🛒</span>
              <span>eShop</span>
            </div>
            <div className={`${styles.navItem} ${styles.navCenter}`}>
              <div className={styles.scanBtn}>📷</div>
            </div>
            <div className={styles.navItem}>
              <span className={styles.navIcon}>💲</span>
              <span>GOfinance</span>
            </div>
            <div className={styles.navItem} onClick={() => setShowPennyPopup(true)} style={{ cursor: "pointer" }}>
              <span className={styles.navIcon}>📍</span>
              <span>Near Me</span>
            </div>
          </div>

          {/* Penny Suspicious Activity Popup */}
          {showPennyPopup && (
            <div className={styles.verificationOverlay}>
              <div className={styles.verificationCard}>
                <div className={styles.errorIconWrap}>
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#d32f2f" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className={styles.verificationTitle} style={{ color: "#d32f2f" }}>Suspicious Activity</h2>
                <p className={styles.verificationDesc}>
                  Your mother, <strong>Penny</strong>, is facing a potentially suspicious transaction.
                </p>
                <div className={styles.verificationDetails}>
                  <div className={styles.verificationRow}>
                    <span className={styles.verificationLabel}>Recipient</span>
                    <span className={styles.verificationValue}>Unknown Caller</span>
                  </div>
                  <div className={styles.verificationRow}>
                    <span className={styles.verificationLabel}>Amount</span>
                    <span className={styles.verificationValue}>RM 5,000.00</span>
                  </div>
                </div>
                <p className={styles.verificationNote} style={{ marginBottom: "16px" }}>
                  Do you want to block this action to protect her account from potential fraud?
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className={styles.verificationDismissBtn}
                    style={{ flex: 1 }}
                    onClick={() => setShowPennyPopup(false)}
                  >
                    Ignore
                  </button>
                  <button
                    className={styles.successDismissBtn}
                    style={{ flex: 1, backgroundColor: '#d32f2f' }}
                    onClick={() => {
                      setShowPennyPopup(false);
                      // In a real app we'd dispatch an API to block here
                    }}
                  >
                    Block
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // ==================== SCREEN 2: TRANSFER ====================
  if (screen === "transfer") {
    return (
      <>
        <Head>
          <title>Transfer | TNG eWallet</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <div className={styles.phone}>
          {/* Status Bar */}
          <div className={styles.statusBarWhite}>
            <span className={styles.timeBlack}>20:33</span>
            <div className={styles.statusIcons}>
              <span className={styles.signalBlack}>&#9679;&#9679;&#9679;&#9679;</span>
              <span className={styles.wifiBlack}>📶</span>
              <span className={styles.battery}>🔋</span>
            </div>
          </div>

          {/* Transfer Header */}
          <div className={styles.transferHeader}>
            <button className={styles.backBtn} onClick={handleBack}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className={styles.transferTitle}>Transfer</h1>
          </div>

          {/* Tabs */}
          <div className={styles.transferTabs}>
            <div className={`${styles.tab} ${styles.tabActive}`}>Transfer</div>
            <div className={styles.tab}>Receive</div>
            <div className={styles.tab}>Money Packet</div>
          </div>

          <div className={styles.transferBody}>
            {/* Payment Type Selector */}
            <div className={styles.paymentTypes}>
              <button className={`${styles.paymentType} ${styles.paymentTypeActive}`}>eWallet</button>
              <button className={styles.paymentType}>DuitNow</button>
              <button className={styles.paymentType}>Overseas</button>
            </div>

            {/* Phone Input */}
            <div className={styles.phoneInputRow}>
              <div className={styles.countryCode}>+60 ▾</div>
              <div className={styles.phoneInputWrap}>
                <span className={styles.phoneInputLabel}>Enter name or phone number</span>
                <input
                  type="tel"
                  className={styles.phoneInput}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  autoFocus
                />
              </div>
              {phoneInput.length > 0 && (
                <button className={styles.clearBtn} onClick={handleClearPhone}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#ccc">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" />
                  </svg>
                </button>
              )}
            </div>

            {/* Show "Tap Next to send to" card when phone is valid */}
            {isPhoneValid && (
              <>
                <div className={styles.sendToCard}>
                  <div className={styles.sendToAvatar}>
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="#005abb">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                  </div>
                  <div className={styles.sendToInfo}>
                    <div className={styles.sendToLabel}>Tap &apos;Next&apos; to send to</div>
                    <div className={styles.sendToPhone}>{formatPhone(phoneInput)}</div>
                  </div>
                </div>

                <div className={styles.nextBtnWrap}>
                  <button className={styles.nextBtnBlue} onClick={handleNextClick}>NEXT</button>
                </div>
              </>
            )}

            {/* Show promo & contacts only when no valid phone entered */}
            {!isPhoneValid && (
              <>
                {/* Soundbox Promo */}
                <div className={styles.promoCard}>
                  <div className={styles.promoIcon}>
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="#FFB800">
                      <circle cx="12" cy="12" r="10" fill="#FFF3CD" stroke="#FFB800" strokeWidth="1.5" />
                      <text x="12" y="17" textAnchor="middle" fontSize="14" fill="#FFB800" fontWeight="bold">!</text>
                    </svg>
                  </div>
                  <div className={styles.promoText}>
                    <div className={styles.promoTitle}>Get a Soundbox TransferMate!</div>
                    <div className={styles.promoSub}>Get instant sound alerts when you receive money.</div>
                    <div className={styles.promoLink}>Explore now</div>
                  </div>
                  <button className={styles.promoClose}>✕</button>
                </div>

                {/* Recent Contacts */}
                <div className={styles.recentHeader}>
                  <span className={styles.recentTitle}>Recent</span>
                  <span className={styles.viewAll}>View All</span>
                </div>

                <div className={styles.contactList}>
                  {recentContacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className={styles.contactItem}
                      onClick={() => {
                        setPhoneInput(contact.phone.replace(/[^0-9]/g, ""));
                      }}
                    >
                      <div className={styles.contactAvatar}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="#005abb">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                      </div>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactName}>{contact.name}</div>
                        <div className={styles.contactPhone}>{contact.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Balance Footer */}
                <div className={styles.transferFooter}>
                  <span>Transferable eWallet balance: RM 7889.53</span>
                  <span className={styles.infoIcon}>ⓘ</span>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // ==================== SCREEN 3: TRANSFER MONEY ====================
  if (screen === "transferMoney") {
    return (
      <>
        <Head>
          <title>Transfer Money | TNG eWallet</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <div className={styles.phone}>
          {/* Status Bar */}
          <div className={styles.statusBarWhite}>
            <span className={styles.timeBlack}>20:33</span>
            <div className={styles.statusIcons}>
              <span className={styles.signalBlack}>&#9679;&#9679;&#9679;&#9679;</span>
              <span className={styles.wifiBlack}>📶</span>
              <span className={styles.battery}>🔋</span>
            </div>
          </div>

          {/* Header */}
          <div className={styles.moneyHeader}>
            <button className={styles.backBtnDark} onClick={handleBack}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#222" strokeWidth="2.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className={styles.moneyTitle}>Transfer Money</h1>
          </div>

          <div className={styles.moneyBody}>
            {/* Transfer To Card */}
            <div className={styles.transferToLabel}>Transfer to</div>
            <div className={styles.recipientCard}>
              <div className={styles.recipientAvatar}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="#005abb">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <div className={styles.recipientInfo}>
                <div className={styles.recipientName}>{resolvedName.toUpperCase()}</div>
                <div className={styles.recipientNameSmall}>{resolvedName}</div>
                <div className={styles.recipientPhone}>
                  {phoneInput ? `+60 ${phoneInput.replace(/^\+?60/, "").replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2 $3")}` : "+60 XX-XXX XXXX"}
                </div>
              </div>
            </div>
            <div className={styles.verifyNote}>
              <span className={styles.verifyCheck}>✓</span>
              Always verify recipient name before transferring.
            </div>

            {/* Amount */}
            <div className={styles.amountSection}>
              <div className={styles.amountLabel}>Amount</div>
              <div className={styles.amountInputRow}>
                {amountValue && <span className={styles.amountPrefix}>RM</span>}
                <input
                  type="text"
                  className={amountValue ? styles.amountInputBlue : styles.amountInput}
                  placeholder={amountValue ? "" : "Amount"}
                  value={amountValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    setAmountValue(val);
                    setShowLimitError(false);
                  }}
                />
              </div>
              <div className={styles.amountLimit}>You can transfer up to RM 7889.53 ⓘ</div>
              {showLimitError && (
                <div style={{ color: "#d32f2f", fontSize: "14px", marginTop: "8px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>❌</span> Over the safety limit 
                </div>
              )}
            </div>

            {/* Send Gift */}
            <button className={styles.sendGiftBtn}>
              <span>🎁</span> Send gift
            </button>

            {/* Transfer Purpose */}
            <div className={styles.purposeSection}>
              <div className={styles.purposeLabel}>What&apos;s the transfer for?</div>
              <div className={styles.purposeRow}>
                <span className={styles.purposeValue}>Fund Transfer</span>
                <span className={styles.purposeCount}>13/50</span>
              </div>
            </div>

            {/* Pick Greeting */}
            <button className={styles.greetingBtn}>Pick a Greeting</button>



            {/* Next Button */}
            <button 
              className={amountValue ? styles.nextBtnActive : styles.nextBtn}
              disabled={isProcessing}
              onClick={async () => {
                if (!amountValue) return;

                const amount = parseFloat(amountValue);
                const limit = parseFloat(transferLimit);

                // If amount exceeds safety limit, run fraud risk evaluation
                if (amount > limit) {
                  setShowLimitError(true);
                  setIsProcessing(true);
                  setTxError(null);

                  try {
                    console.log("[TNG] Amount exceeds safety limit, triggering fraud check...");
                    const result = await startTransaction({
                      userId: "user_001",
                      amount,
                      recipient: phoneInput,
                    });

                    setTxId(result.txId);
                    setRiskScore(result.score1);
                    setTxStatus(result.status);

                    if (result.status === "SAFE") {
                      console.log("[TNG] Transaction deemed SAFE. Proceeding.");
                      // Simulate brief delay then show success
                      setTimeout(() => {
                        setTxStatus("SUCCESS");
                      }, 5000);
                    } else if (result.status === "AI_CALL_TRIGGERED") {
                      console.log("[TNG] AI Call triggered. Risk score:", result.score1);
                      // Also trigger the AI verification call
                      try {
                        await fetch('/api/trigger_call', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            phoneNumber: "+60103604883",
                            txId: result.txId,
                            status: result.status,
                            score1: result.score1,
                          }),
                        });
                        console.log("[TNG] AI verification call dispatched.");
                      } catch (callErr) {
                        console.error('[TNG] Error dispatching AI call:', callErr);
                      }
                    }
                  } catch (err) {
                    console.error("[TNG] Transaction check failed:", err);
                    setTxStatus("ERROR");
                    setTxError(err.message);
                  } finally {
                    setIsProcessing(false);
                  }
                } else {
                  // Amount within limit — proceed directly
                  console.log("[TNG] Amount within safety limit. Proceeding.");
                  setTxStatus("SUCCESS");
                }
              }}
            >
              {isProcessing ? "Verifying..." : "Next"}
            </button>

            {/* ===== Transaction Status Overlay ===== */}
            {txStatus === "AI_CALL_TRIGGERED" && (
              <div className={styles.verificationOverlay}>
                <div className={styles.verificationCard}>
                  <div className={styles.verificationIconWrap}>
                    <div className={styles.verificationPulse}></div>
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#ff6b35" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <h2 className={styles.verificationTitle}>Transaction Under Verification</h2>
                  <p className={styles.verificationDesc}>AI call initiated to verify this transaction.</p>
                  <div className={styles.verificationDetails}>
                    <div className={styles.verificationRow}>
                      <span className={styles.verificationLabel}>Transaction ID</span>
                      <span className={styles.verificationValue}>{txId?.slice(0, 8)}...</span>
                    </div>
                    <div className={styles.verificationRow}>
                      <span className={styles.verificationLabel}>Risk Score</span>
                      <span className={styles.verificationScoreBadge}>{riskScore}</span>
                    </div>
                    <div className={styles.verificationRow}>
                      <span className={styles.verificationLabel}>Amount</span>
                      <span className={styles.verificationValue}>RM {amountValue}</span>
                    </div>
                  </div>
                  <p className={styles.verificationNote}>
                    📞 You will receive a verification call shortly. Please answer to confirm or cancel this transaction.
                  </p>
                  <button
                    className={styles.verificationDismissBtn}
                    onClick={() => {
                      setTxStatus(null);
                      setTxId(null);
                      setRiskScore(null);
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {txStatus === "SUCCESS" && (
              <div className={styles.verificationOverlay}>
                <div className={styles.verificationCard}>
                  <div className={styles.successIconWrap}>
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#00c853" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12l3 3 5-5" />
                    </svg>
                  </div>
                  <h2 className={styles.verificationTitle} style={{ color: "#00c853" }}>Transfer Successful</h2>
                  <p className={styles.verificationDesc}>RM {amountValue} has been sent to {resolvedName}.</p>
                  <button
                    className={styles.successDismissBtn}
                    onClick={() => {
                      setTxStatus(null);
                      setAmountValue("");
                      setScreen("home");
                      setPhoneInput("");
                      setResolvedName("");
                      setShowLimitError(false);
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {txStatus === "ERROR" && (
              <div className={styles.verificationOverlay}>
                <div className={styles.verificationCard}>
                  <div className={styles.errorIconWrap}>
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#d32f2f" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 8l8 8M16 8l-8 8" />
                    </svg>
                  </div>
                  <h2 className={styles.verificationTitle} style={{ color: "#d32f2f" }}>Verification Failed</h2>
                  <p className={styles.verificationDesc}>{txError || "Unable to verify this transaction. Please try again."}</p>
                  <button
                    className={styles.verificationDismissBtn}
                    onClick={() => {
                      setTxStatus(null);
                      setTxError(null);
                    }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ==================== SCREEN 4: SAFETY LIMIT ====================
  if (screen === "safetyLimit") {
    return (
      <>
        <Head>
          <title>Safety Limit | TNG eWallet</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <div className={styles.phone}>
          <div className={styles.statusBarWhite}>
            <span className={styles.timeBlack}>20:33</span>
            <div className={styles.statusIcons}>
              <span className={styles.signalBlack}>&#9679;&#9679;&#9679;&#9679;</span>
              <span className={styles.wifiBlack}>📶</span>
              <span className={styles.battery}>🔋</span>
            </div>
          </div>
          <div className={styles.moneyHeader}>
            <button className={styles.backBtnDark} onClick={handleBack}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#222" strokeWidth="2.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className={styles.moneyTitle}>Scam Protection Settings</h1>
          </div>
          <div className={styles.moneyBody} style={{ padding: "24px 16px" }}>
            <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#333" }}>
              Transfer Safety Limit:
            </div>
            <div className={styles.amountInputRow} style={{ borderBottom: "1.5px solid #eee", paddingBottom: "8px", marginBottom: "32px" }}>
              <span className={styles.amountPrefix}>RM</span>
              <input
                type="text"
                className={styles.amountInputBlue}
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
              />
            </div>
            <button 
              className={styles.nextBtnActive} 
              onClick={() => {
                setTransferLimit(limitInput || "0");
                setScreen("home");
              }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
}
