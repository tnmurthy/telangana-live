import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';
import './CTA.css';

export function CTA() {
  return (
    <section className="cta">
      <div className="cta__background">
        <div className="cta__blob cta__blob--1"></div>
        <div className="cta__blob cta__blob--2"></div>
      </div>

      <motion.div
        className="cta__content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2>Ready to Get Started?</h2>
        <p>
          Join thousands of developers building amazing applications with Nexus.
          Start free today.
        </p>
        <motion.div
          whileHover={{ x: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Button variant="primary" size="lg">
            Start Your Free Trial
            <ArrowRight size={20} />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
