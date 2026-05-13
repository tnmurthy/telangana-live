import { motion } from 'framer-motion';
import { Zap, Shield, Layers, Gauge, Code2, Rocket } from 'lucide-react';
import './Features.css';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance with sub-millisecond response times',
    color: '#ff6b35',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with GDPR, SOC 2',
    color: '#00d4aa',
  },
  {
    icon: Layers,
    title: 'Scalable Architecture',
    description: 'Handle millions of requests without breaking a sweat',
    color: '#0066ff',
  },
  {
    icon: Gauge,
    title: 'Real-time Analytics',
    description: 'Track every metric with comprehensive dashboards',
    color: '#ffc107',
  },
  {
    icon: Code2,
    title: 'Developer Friendly',
    description: 'Intuitive APIs and extensive documentation',
    color: '#8b5cf6',
  },
  {
    icon: Rocket,
    title: 'Deploy Instantly',
    description: 'One-click deployment to global infrastructure',
    color: '#ec4899',
  },
];

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="features" id="features">
      <div className="features__header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2>Powerful Features</h2>
          <p>Everything you need to build and scale your application</p>
        </motion.div>
      </div>

      <motion.div
        className="features__grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="feature-card__icon" style={{ color: feature.color }}>
                <Icon size={32} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div
                className="feature-card__gradient"
                style={{ background: feature.color }}
              ></div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
