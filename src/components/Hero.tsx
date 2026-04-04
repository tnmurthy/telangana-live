import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';
import './Hero.css';

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="hero">
      <div className="hero__background">
        <div className="hero__gradient"></div>
        <div className="hero__blob hero__blob--1"></div>
        <div className="hero__blob hero__blob--2"></div>
      </div>

      <div className="hero__container">
        <motion.div
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="hero__badge"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={16} />
            <span>Introducing Nexus - The Future of SaaS</span>
          </motion.div>

          <motion.h1 className="hero__title" variants={itemVariants}>
            Build Extraordinary <span className="gradient-text">Digital Experiences</span>
          </motion.h1>

          <motion.p className="hero__subtitle" variants={itemVariants}>
            Create stunning, responsive applications with powerful features, beautiful design,
            and an intuitive development experience. Join thousands of developers building
            the future.
          </motion.p>

          <motion.div className="hero__buttons" variants={itemVariants}>
            <Button variant="primary" size="lg">
              Get Started Free
              <ArrowRight size={20} />
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </motion.div>

          <motion.div className="hero__stats" variants={itemVariants}>
            {[
              { label: 'Active Users', value: '50K+' },
              { label: 'Projects', value: '10K+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat) => (
              <div key={stat.label} className="stat">
                <div className="stat__value">{stat.value}</div>
                <div className="stat__label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__visual"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 1 }}
        >
          <div className="hero__card">
            <div className="hero__card-header">
              <div className="hero__card-dot"></div>
              <div className="hero__card-dot"></div>
              <div className="hero__card-dot"></div>
            </div>
            <div className="hero__card-body">
              <motion.div
                className="hero__code-line"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                const nexus = await createProject()
              </motion.div>
              <motion.div
                className="hero__code-line hero__code-line--delayed"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
              >
                await nexus.deploy()
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
