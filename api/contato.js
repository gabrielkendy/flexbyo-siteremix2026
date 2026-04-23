const { Resend } = require('resend');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function validate(data) {
  var errors = [];
  if (!data.nome || data.nome.trim().length < 3 || !/\s/.test(data.nome.trim())) errors.push('Nome completo invalido');
  if (!data.whatsapp || data.whatsapp.replace(/\D/g, '').length < 10) errors.push('WhatsApp invalido');
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.push('E-mail invalido');
  return errors;
}

function esc(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }

function emailHtml(data) {
  var mods = { 'hot-yoga':'Hot Yoga','hot-pilates':'Hot Pilates','mat-pilates':'Mat Pilates','mix-pilates':'Mix Pilates','power-pilates':'Power Pilates','flow-pilates':'Flow Pilates','individual':'Individual','':'Ainda nao sabe' };
  var exps = { 'sim':'Pratica regularmente','pouco':'Ja experimentou','nao':'Nunca praticou','':'Nao respondeu' };
  var mod = mods[data.modalidade||''] || data.modalidade || 'Nao especificada';
  var exp = exps[data.experiencia||''] || data.experiencia || 'Nao respondido';
  var nasc = data.nascimento ? new Date(data.nascimento).toLocaleDateString('pt-BR') : 'Nao informada';
  var waLink = 'https://wa.me/55' + data.whatsapp.replace(/\D/g, '');

  return '<!DOCTYPE html><html><head><meta charset="utf-8"></head>' +
    '<body style="margin:0;padding:40px 20px;background:#F5F1EA;font-family:sans-serif;color:#0A0A0A;">' +
    '<div style="max-width:580px;margin:0 auto;background:white;border-radius:6px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.08);">' +
    '<div style="background:#0E6A75;padding:40px;color:#F5F1EA;">' +
    '<div style="font-size:14px;letter-spacing:4px;text-transform:uppercase;color:#00A8AD;margin-bottom:12px;">NOVO LEAD - RESTART</div>' +
    '<h1 style="font-family:Georgia,serif;font-weight:300;font-size:34px;line-height:1.1;margin:0;">Nova aluna quer <em style="color:#00A8AD;">experimentar</em>.</h1>' +
    '</div>' +
    '<div style="padding:40px;">' +
    '<div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#0E6A75;font-weight:600;margin-bottom:20px;">Dados de contato</div>' +
    '<table style="width:100%;border-collapse:collapse;">' +
    '<tr><td style="padding:10px 0;border-bottom:1px solid #EDE7DB;color:#555;font-size:13px;">Nome</td><td style="padding:10px 0;border-bottom:1px solid #EDE7DB;font-size:15px;font-weight:500;text-align:right;">' + esc(data.nome) + '</td></tr>' +
    '<tr><td style="padding:10px 0;border-bottom:1px solid #EDE7DB;color:#555;font-size:13px;">WhatsApp</td><td style="padding:10px 0;border-bottom:1px solid #EDE7DB;font-size:15px;font-weight:500;text-align:right;"><a href="' + waLink + '" style="color:#0E6A75;text-decoration:none;">' + esc(data.whatsapp) + '</a></td></tr>' +
    '<tr><td style="padding:10px 0;border-bottom:1px solid #EDE7DB;color:#555;font-size:13px;">E-mail</td><td style="padding:10px 0;border-bottom:1px solid #EDE7DB;font-size:15px;font-weight:500;text-align:right;"><a href="mailto:' + esc(data.email) + '" style="color:#0E6A75;text-decoration:none;">' + esc(data.email) + '</a></td></tr>' +
    '<tr><td style="padding:10px 0;color:#555;font-size:13px;">Nascimento</td><td style="padding:10px 0;font-size:15px;text-align:right;">' + esc(nasc) + '</td></tr>' +
    '</table>' +
    '<div style="margin:32px 0;padding:24px;background:#EDE7DB;border-left:3px solid #00A8AD;border-radius:3px;">' +
    '<div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#0E6A75;font-weight:600;margin-bottom:14px;">Perfil</div>' +
    '<div style="margin-bottom:12px;"><div style="font-size:12px;color:#555;">Modalidade</div><div style="font-size:16px;font-weight:500;margin-top:2px;">' + esc(mod) + '</div></div>' +
    '<div><div style="font-size:12px;color:#555;">Experiencia</div><div style="font-size:16px;font-weight:500;margin-top:2px;">' + esc(exp) + '</div></div>' +
    '</div>' +
    (data.mensagem ? '<div style="margin-bottom:32px;"><div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#0E6A75;font-weight:600;margin-bottom:14px;">Mensagem</div><p style="font-family:Georgia,serif;font-style:italic;font-size:15px;line-height:1.6;color:#444;margin:0;padding:16px;background:#FAF8F3;border-radius:3px;">"' + esc(data.mensagem) + '"</p></div>' : '') +
    '<div style="text-align:center;margin-top:40px;padding-top:32px;border-top:1px solid #EDE7DB;">' +
    '<a href="' + waLink + '?text=' + encodeURIComponent('Ola ' + (data.nome||'').split(' ')[0] + '! Vi que voce quer agendar seu Restart na FlexByo. Tudo certo?') + '" style="display:inline-block;padding:16px 32px;background:#00A8AD;color:#0A0A0A;font-weight:600;font-size:14px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border-radius:3px;">Responder no WhatsApp &rarr;</a>' +
    '</div>' +
    '<div style="margin-top:40px;padding-top:24px;border-top:1px solid #EDE7DB;font-size:11px;color:#888;letter-spacing:1px;text-align:center;">Lead capturado pelo site<br>FlexByo Academy - Producao Agencia BASE</div>' +
    '</div></div></body></html>';
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    var data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (data._honeypot) return res.status(200).json({ ok: true });

    var errors = validate(data);
    if (errors.length) return res.status(400).json({ error: 'Dados invalidos', details: errors });

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY nao configurada');
      return res.status(500).json({ error: 'Servidor de email nao configurado' });
    }

    var TO = process.env.CONTACT_TO || 'gabriel.kendy@hotmail.com';
    var FROM = process.env.CONTACT_FROM || 'FlexByo Site <onboarding@resend.dev>';
    var CC = process.env.CONTACT_CC;

    var resend = new Resend(process.env.RESEND_API_KEY);

    var payload = {
      from: FROM,
      to: [TO],
      subject: 'Novo Restart - ' + (data.nome||'').split(' ')[0] + ' quer experimentar',
      html: emailHtml(data),
      reply_to: data.email
    };
    if (CC) payload.cc = [CC];

    var result = await resend.emails.send(payload);

    if (result.error) {
      console.error('Resend erro:', result.error);
      return res.status(500).json({ error: 'Falha ao enviar email', details: result.error.message });
    }

    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, source: 'flexbyo-site', received_at: new Date().toISOString(), resend_id: result.data && result.data.id })
        });
      } catch (e) { console.warn('N8N webhook falhou:', e.message); }
    }

    return res.status(200).json({ ok: true, message: 'Lead enviado', id: result.data && result.data.id });
  } catch (err) {
    console.error('Erro:', err);
    return res.status(500).json({ error: 'Erro interno', details: err.message });
  }
};
