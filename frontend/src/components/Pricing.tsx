import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from './Button';
import './Pricing.css';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfect for individuals and small projects',
    features: [
      'Up to 10K requests/month',
      'Basic analytics',
      'Community support',
      '99.5% uptime SLA',
      '5GB storage',
    ],
  },
  {
    name: 'Professional',
    price: '$99',
    description: 'For growing businesses and teams',
    features: [
      'Up to 1M requests/month',
      'Advanced analytics',
      'Priority email support',
      '99.9% uptime SLA',
      '100GB storage',
      'Custom domain',
      'Team collaboration',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale operations',
    features: [
      'Unlimited requests',
      'Real-time analytics',
      '24/7 phone support',
      '99.99% uptime SLA',
      'Unlimited storage',
      'Custom domain',
      'Dedicated account manager',
      'SOC 2 compliance',
    ],
  },
];

export function Pricing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="pricing" id="pricing">
      <div className="pricing__header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the perfect plan for your needs</p>
        </motion.div>
      </div>

      <motion.div
        className="pricing__grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            className={`pricing-card ${plan.featured ? 'pricing-card--featured' : ''}`}
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            <div className="pricing-card__header">
              <h3>{plan.name}</h3>
              <div className="pricing-card__price">
                <span className="price">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="period">/month</span>}
              </div>
              <p className="pricing-card__description">{plan.description}</p>
            </div>

            <Button
              variant={plan.featured ? 'primary' : 'outline'}
              fullWidth
              size="lg"
            >
              Get Started
            </Button>

            <div className="pricing-card__features">
              {plan.features.map((feature) => (
                <div key={feature} className="pricing-feature">
                  <Check size={20} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
