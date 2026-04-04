import { motion } from 'framer-motion';
import { GitBranch, Share2, MessageCircle, Mail } from 'lucide-react';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: ['Features', 'Pricing', 'Security', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Resources: ['Docs', 'API', 'Community', 'Support'],
    Legal: ['Privacy', 'Terms', 'Cookies', 'License'],
  };

  const socialLinks = [
    { icon: GitBranch, href: '#', label: 'GitHub' },
    { icon: MessageCircle, href: '#', label: 'Twitter' },
    { icon: Share2, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__grid">
          <motion.div
            className="footer__brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="footer__logo">Nexus</div>
            <p>Build extraordinary digital experiences with modern tools.</p>
            <div className="footer__socials">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="footer__social-link"
                    whileHover={{ scale: 1.2, y: -3 }}
                    transition={{ duration: 0.2 }}
                    title={link.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {Object.entries(footerLinks).map((column, index) => (
            <motion.div
              key={column[0]}
              className="footer__column"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <h4>{column[0]}</h4>
              <ul>
                {column[1].map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            <p>&copy; {currentYear} Nexus. All rights reserved.</p>
          </div>
          <div className="footer__divider"></div>
          <div className="footer__status">
            <span className="status-indicator"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
