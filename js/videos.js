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

Me gustaría que la respondieran por WhatsApp o en la seccion de preguntas frecuentes cuando aplique.`;
  }

  function bindQuestionForm(site) {
    const form = document.getElementById('question-form');
    const feedback = document.getElementById('question-feedback');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const question = valueFor('question-text');

      if (!question) {
        if (feedback) feedback.textContent = 'Escribe tu pregunta para poder enviarla.';
        return;
      }

      const href = app.whatsappUrl(site, questionMessage());
      if (!href) {
        if (feedback) feedback.textContent = 'El WhatsApp aun no esta configurado.';
        return;
      }

      if (feedback) feedback.textContent = 'Abriendo WhatsApp con tu pregunta preparada.';
      window.open(href, '_blank', 'noopener,noreferrer');
    });
  }

  try {
    const site = await app.getSite();
    bindQuestionForm(site);
  } catch (error) {
    console.error(error);
  }
})();
