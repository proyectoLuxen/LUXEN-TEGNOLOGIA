(async function () {
  const app = window.LuxenStore;

  function valueFor(id) {
    return document.getElementById(id)?.value.trim() || '';
  }

  function questionMessage() {
    const topic = valueFor('question-topic') || 'Pregunta general';
    const name = valueFor('question-name') || 'Sin nombre';
    const question = valueFor('question-text');

    return `Hola, tengo una pregunta para LUXEN TECNOLOGÍA.

Tema: ${topic}
Nombre: ${name}
Pregunta:
${question}

Me gustaría recibir la respuesta por WhatsApp.`;
  }

  function bindQuestionForm(site) {
    const form = document.getElementById('question-form');
    const feedback = document.getElementById('question-feedback');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const question = valueFor('question-text');

      if (!question) {
        if (feedback) feedback.textContent = 'Escriba su pregunta para poder enviarla.';
        return;
      }

      const href = app.whatsappUrl(site, questionMessage());
      if (!href) {
        if (feedback) feedback.textContent = 'El WhatsApp aún no está configurado.';
        return;
      }

      if (feedback) feedback.textContent = 'Abriendo WhatsApp con su pregunta lista para enviar.';
      // Con 'noopener' window.open siempre devuelve null; se abre sin él y se corta la referencia
      const opened = window.open(href, '_blank');
      if (opened) {
        opened.opener = null;
      } else {
        window.location.href = href;
      }
    });
  }

  try {
    const site = await app.getSite();
    bindQuestionForm(site);
  } catch (error) {
    console.error(error);
  }
})();
