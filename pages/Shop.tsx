import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { SUBSCRIPTION_PLANS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '../hooks/useAuthSession';
import { useI18n } from '../i18n';

export const Shop: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.cycle === billingCycle) || SUBSCRIPTION_PLANS[0];
    const [isPaying, setIsPaying] = useState(false);
    const [isOpeningPortal, setIsOpeningPortal] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuthSession();
    const { t } = useI18n();

    const translatePlanPerk = (perk: string) => {
        const map: Record<string, string> = {
            'Ad-free': t('perk.adFree'),
            '1080p/4K': t('perk.resolution'),
            'Early access episodes': t('perk.earlyAccessEpisodes'),
            'Priority support': t('perk.prioritySupport'),
            'Everything in monthly': t('perk.everythingInMonthly'),
            '2 months free': t('perk.twoMonthsFree'),
            'Exclusive badge': t('perk.exclusiveBadge'),
            'Limited events': t('perk.limitedEvents'),
        };
        return map[perk] || perk;
    };

    const handleSubscribe = async () => {
        setError('');
        if (!user) {
            navigate('/auth');
            return;
        }
        setIsPaying(true);
        try {
            const response = await fetch('/api/billing/checkout', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ cycle: billingCycle }),
            });
            const payload = await response.json();
            if (!response.ok) {
                setError(payload.error || t('shop.errorCreateCheckout'));
                return;
            }
            if (payload.checkoutUrl) {
                window.location.href = payload.checkoutUrl;
                return;
            }
            setError(t('shop.errorInvalidCheckoutUrl'));
        } catch {
            setError(t('shop.errorPayRequest'));
        } finally {
            setIsPaying(false);
        }
    };

    const handleManageSubscription = async () => {
        setError('');
        if (!user) {
            navigate('/auth');
            return;
        }
        setIsOpeningPortal(true);
        try {
            const response = await fetch('/api/billing/portal', {
                method: 'POST',
                credentials: 'include',
            });
            const payload = await response.json();
            if (!response.ok) {
                setError(payload.error || t('shop.errorOpenBilling'));
                return;
            }
            if (payload.portalUrl) {
                window.location.href = payload.portalUrl;
                return;
            }
            setError(t('shop.errorInvalidPortalUrl'));
        } catch {
            setError(t('shop.errorPortalRequest'));
        } finally {
            setIsOpeningPortal(false);
        }
    };

    return (
        <div className="w-full min-h-screen pt-20 px-4 md:px-20 lg:px-40 pb-20">
            <div className="max-w-6xl mx-auto w-full">
                {/* Hero */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-[#ff6b9d] bg-clip-text text-transparent">
                        {t('shop.heroTitle')}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('shop.heroSubtitle')}
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-10">
                    <div className="flex h-12 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                        <button 
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm' : 'text-gray-500'}`}
                        >
                            {t('shop.billingMonthly')}
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm' : 'text-gray-500'}`}
                        >
                            {t('shop.billingYearly')} <span className="text-[10px] bg-yellow-400 text-black px-1.5 py-0.5 rounded-full uppercase">{t('shop.savePercent')}</span>
                        </button>
                    </div>
                </div>

                {/* Subscription Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="flex flex-col gap-6 rounded-2xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 transition-all hover:border-primary/30">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-xs tracking-widest">
                                <Icon name="person" className="text-sm" /> {t('shop.standard')}
                            </div>
                            <h3 className="text-2xl font-bold dark:text-white">{t('shop.freePlan')}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black dark:text-white">$0</span>
                                <span className="text-gray-500 text-sm">{t('shop.perMonth')}</span>
                            </div>
                        </div>
                        <button className="w-full py-3 px-6 rounded-xl bg-gray-100 dark:bg-white/10 font-bold text-gray-700 dark:text-white hover:bg-gray-200 transition-colors">
                            {t('shop.currentPlan')}
                        </button>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-3 text-sm dark:text-gray-300">
                                <Icon name="check_circle" filled className="text-green-500" /> {t('shop.freeFeatureHd')}
                            </li>
                            <li className="flex items-center gap-3 text-sm dark:text-gray-300">
                                <Icon name="check_circle" filled className="text-green-500" /> {t('shop.freeFeatureLibrary')}
                            </li>
                            <li className="flex items-center gap-3 text-sm opacity-50 dark:text-gray-500">
                                <Icon name="cancel" /> {t('shop.freeFeatureAds')}
                            </li>
                        </ul>
                    </div>

                    {/* VIP Plan */}
                    <div className="relative flex flex-col gap-6 rounded-2xl border-2 border-primary bg-white dark:bg-white/5 p-8 shadow-xl shadow-primary/10 transform md:scale-105 ring-4 ring-primary/5">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            {t('shop.mostPopular')}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                                <Icon name="workspace_premium" className="text-sm" /> {t('shop.vipPremium')}
                            </div>
                            <h3 className="text-2xl font-bold dark:text-white">{t('shop.eliteVipMember')}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-primary">${selectedPlan.amountUsd.toFixed(2)}</span>
                                <span className="text-gray-500 text-sm">{billingCycle === 'monthly' ? t('shop.perMonth') : t('shop.perYear')}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleSubscribe}
                            disabled={isPaying}
                            className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                        >
                            {isPaying ? t('shop.redirectingStripe') : t('shop.subscribeStripe')}
                        </button>
                        <ul className="flex flex-col gap-4">
                             {selectedPlan.perks.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium dark:text-white">
                                    <Icon name="verified" filled className="text-primary" /> {translatePlanPerk(feature)}
                                </li>
                             ))}
                        </ul>
                    </div>
                </div>

                {/* Coin Shop Section */}
                <div className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                <Icon name="toll" className="text-xs" /> {t('shop.coinShop')}
                            </div>
                            <h2 className="text-3xl font-black dark:text-white">{t('shop.topUpCoins')}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('shop.coinsSubtitle')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Coin Packages */}
                        {[
                            { coins: 100, price: 0.99, name: t('shop.packStarter'), icon: "toll", color: "text-yellow-500" },
                            { coins: 500, bonus: 50, price: 4.99, name: t('shop.packAdventurer'), icon: "payments", color: "text-yellow-500", tag: t('shop.packBonus10') },
                            { coins: 1200, bonus: 300, price: 9.99, name: t('shop.packValue'), icon: "savings", color: "text-yellow-500", tag: t('shop.packBonus25'), popular: true },
                            { coins: 5000, bonus: 2000, price: 44.99, name: t('shop.packWhale'), icon: "monetization_on", color: "text-yellow-500", tag: t('shop.packBonus40') },
                        ].map((pack, i) => (
                            <div key={i} className={`group relative flex flex-col items-center gap-4 rounded-2xl border bg-white dark:bg-white/5 p-6 text-center transition-all cursor-pointer ${pack.popular ? 'border-primary shadow-lg shadow-primary/5' : 'border-gray-200 dark:border-white/10 hover:border-primary'}`}>
                                {pack.tag && (
                                    <div className="absolute -top-3 right-4 bg-primary text-white text-[9px] font-black px-2 py-1 rounded-md shadow-md uppercase">
                                        {pack.tag}
                                    </div>
                                )}
                                <div className={`size-16 flex items-center justify-center rounded-full transition-colors ${pack.popular ? 'bg-primary/10' : 'bg-gray-100 dark:bg-white/10 group-hover:bg-primary/10'}`}>
                                    <Icon name={pack.icon} className={`${pack.color} text-3xl`} />
                                </div>
                                <div>
                                    <div className="text-xl font-black dark:text-white">
                                        {pack.coins.toLocaleString()} {pack.bonus && <span className="text-primary text-sm">+{pack.bonus}</span>}
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 uppercase">{pack.name}</div>
                                </div>
                                <button className={`w-full py-2 rounded-lg font-bold transition-all ${pack.popular ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 dark:bg-white/10 group-hover:bg-primary group-hover:text-white text-gray-800 dark:text-white'}`}>
                                    ${pack.price}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-2xl mx-auto">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold">
                            {error}
                        </div>
                    )}
                    <div className="mb-10 flex justify-center">
                        <button
                            onClick={handleManageSubscription}
                            disabled={isOpeningPortal}
                            className="px-6 py-3 rounded-xl border border-primary/30 text-primary font-bold hover:bg-primary/5 disabled:opacity-60 transition-colors"
                        >
                            {isOpeningPortal ? t('shop.manageStripeOpening') : t('shop.manageStripe')}
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-10 dark:text-white">{t('shop.faqTitle')}</h2>
                    <div className="space-y-4">
                        {[
                            t('shop.faq1'),
                            t('shop.faq2'),
                            t('shop.faq3'),
                        ].map((q, i) => (
                             <div key={i} className="p-5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary/50 transition-colors cursor-pointer bg-white dark:bg-white/5 flex items-center justify-between group">
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{q}</h4>
                                <Icon name="add" className="text-gray-400 group-hover:text-primary" />
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
