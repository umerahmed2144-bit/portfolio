import { contact, contactIntro, isTodo, person, SHOW_TODOS } from "../content";
import Eyebrow from "../components/Eyebrow";
import Reveal from "../components/Reveal";
import RevealText from "../components/RevealText";
import TodoLink from "../components/TodoLink";
import "./Contact.css";

const whatsappHref = isTodo(contact.whatsapp)
  ? contact.whatsapp
  : `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;
const mailHref = isTodo(contact.email) ? contact.email : `mailto:${contact.email}`;

export default function Contact() {
  return (
    <footer id="contact" className="contact">
      <Eyebrow>{contactIntro.eyebrow}</Eyebrow>
      <RevealText as="h2" className="display contact-h" lines={contactIntro.heading} stagger={90} duration={950} />
      <Reveal as="p" className="contact-body" duration={520}>
        {contactIntro.body}
      </Reveal>

      <Reveal className="contact-email-wrap" delay={100}>
        {isTodo(contact.email) ? (
          <span className="contact-email is-todo" data-todo={contact.email}>
            {SHOW_TODOS ? contact.email : "Email coming soon"}
            <span className="contact-arrow" aria-hidden="true">↗</span>
          </span>
        ) : (
          <a href={mailHref} className="contact-email">
            {contact.email}
            <span className="contact-arrow" aria-hidden="true">↗</span>
          </a>
        )}
      </Reveal>

      <Reveal className="contact-actions" delay={180}>
        <TodoLink href={whatsappHref} className="btn btn-primary" external pendingLabel="WhatsApp coming soon">
          WhatsApp me
          <span className="arrow" aria-hidden="true">↗</span>
        </TodoLink>
        <TodoLink href={contact.linkedin} className="btn btn-ghost" external pendingLabel="LinkedIn coming soon">
          LinkedIn
          <span className="arrow" aria-hidden="true">↗</span>
        </TodoLink>
        <TodoLink href={contact.cv} className="btn btn-ghost" download pendingLabel="CV coming soon">
          Download CV
          <span className="arrow" aria-hidden="true">↓</span>
        </TodoLink>
      </Reveal>

      <div className="contact-bar">
        <div className="contact-sign">
          <p className="display contact-signature">{person.name}</p>
          <p className="contact-signoff">{contactIntro.signoff}</p>
        </div>
        <nav className="contact-social" aria-label="Social">
          <ul>
            <li>
              <TodoLink href={contact.linkedin} className="contact-social-link" external pendingLabel="LinkedIn">
                LinkedIn
              </TodoLink>
            </li>
            <li>
              <TodoLink href={whatsappHref} className="contact-social-link" external pendingLabel="WhatsApp">
                WhatsApp
              </TodoLink>
            </li>
            <li>
              <TodoLink href={mailHref} className="contact-social-link" pendingLabel="Email">
                Email
              </TodoLink>
            </li>
          </ul>
        </nav>
        <p className="contact-copy">© {new Date().getFullYear()} {person.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
