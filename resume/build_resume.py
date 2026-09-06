from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path('/Users/claudiaochoa/Documents/Projects/claudia-ochoa')
OUTPUT = ROOT / 'output/pdf/Claudia_Ochoa_Resume.pdf'

BACKGROUND = colors.HexColor('#131313')
SURFACE = colors.HexColor('#151517')
ESPRESSO = colors.HexColor('#FFFFFF')
CLAY = colors.HexColor('#999999')
CLAY_DEEP = colors.HexColor('#F2F2F4')
CREAM = colors.HexColor('#151517')
SAND = colors.HexColor('#303034')
INK_SOFT = colors.HexColor('#A4A4AC')
WHITE = colors.HexColor('#999999')

pdfmetrics.registerFont(TTFont('Georgia', '/System/Library/Fonts/Supplemental/Georgia.ttf'))
pdfmetrics.registerFont(TTFont('Georgia-Bold', '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'))
pdfmetrics.registerFont(TTFont('Georgia-Italic', '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'))
pdfmetrics.registerFont(TTFont('Arial', '/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold', '/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Italic', '/System/Library/Fonts/Supplemental/Arial Italic.ttf'))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='Arial-Bold', italic='Arial-Italic')
pdfmetrics.registerFontFamily('Georgia', normal='Georgia', bold='Georgia-Bold', italic='Georgia-Italic')


class ResumeDoc(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(
            filename,
            pagesize=letter,
            leftMargin=0.3 * inch,
            rightMargin=0.3 * inch,
            topMargin=0.28 * inch,
            bottomMargin=0.45 * inch,
            title='Claudia Ochoa - AI Experience, Product Design, and Brand Strategy Leader',
            author='Claudia Ochoa',
            subject='Resume',
        )
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
        )
        self.addPageTemplates(PageTemplate(id='resume', frames=[frame], onPage=draw_page))


def draw_page(canvas: Canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(BACKGROUND)
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    canvas.setStrokeColor(SAND)
    canvas.line(doc.leftMargin, 0.37 * inch, width - doc.rightMargin, 0.37 * inch)
    canvas.setFont('Arial', 7.5)
    canvas.setFillColor(INK_SOFT)
    canvas.drawString(doc.leftMargin, 0.22 * inch, 'claudiaochoa.co  |  linkedin.com/in/claudiajochoa')
    canvas.drawRightString(width - doc.rightMargin, 0.22 * inch, str(doc.page))
    canvas.restoreState()


styles = getSampleStyleSheet()
name_style = ParagraphStyle(
    'Name', fontName='Arial-Bold', fontSize=26, leading=28, textColor=ESPRESSO, spaceAfter=3
)
title_style = ParagraphStyle(
    'Title', fontName='Arial-Bold', fontSize=9.1, leading=11, textColor=ESPRESSO,
    tracking=1.15, spaceAfter=7
)
contact_style = ParagraphStyle(
    'Contact', fontName='Arial', fontSize=8.7, leading=11, textColor=ESPRESSO, spaceAfter=11
)
section_style = ParagraphStyle(
    'Section', fontName='Arial-Bold', fontSize=8.5, leading=10, textColor=ESPRESSO,
    tracking=1.0, spaceBefore=16, spaceAfter=8
)
summary_style = ParagraphStyle(
    'Summary', fontName='Arial', fontSize=9.15, leading=12.2, textColor=WHITE, spaceAfter=5
)
role_style = ParagraphStyle(
    'Role', fontName='Georgia-Bold', fontSize=11.1, leading=13, textColor=ESPRESSO, spaceAfter=1
)
company_style = ParagraphStyle(
    'Company', fontName='Arial-Bold', fontSize=8.8, leading=10.5, textColor=CLAY, spaceAfter=3
)
body_style = ParagraphStyle(
    'Body', fontName='Arial', fontSize=8.45, leading=11.25, textColor=CLAY, spaceAfter=3
)
bullet_style = ParagraphStyle(
    'Bullet', fontName='Arial', fontSize=8.35, leading=10.9, textColor=WHITE,
    leftIndent=12, firstLineIndent=-7, bulletIndent=0, spaceAfter=4.5
)
small_style = ParagraphStyle(
    'Small', fontName='Arial', fontSize=8.2, leading=10.6, textColor=WHITE, spaceAfter=2
)
impact_number_style = ParagraphStyle(
    'ImpactNumber', fontName='Georgia-Bold', fontSize=12.2, leading=13, textColor=ESPRESSO,
    alignment=TA_CENTER, spaceAfter=2
)
impact_label_style = ParagraphStyle(
    'ImpactLabel', fontName='Arial', fontSize=7.5, leading=9.2, textColor=CLAY,
    alignment=TA_CENTER
)


def P(text, style):
    return Paragraph(text, style)


def section(title):
    return [P(title.upper(), section_style)]


def bullets(items):
    return [P(f'• {item}', bullet_style) for item in items]


def role(title, company, dates, intro, items, trailing_space=10):
    content = [
        P(title, role_style),
        P(f'{company}  |  <font name="Arial"><i>{dates}</i></font>', company_style),
        P(intro, body_style),
        *bullets(items),
        Spacer(1, trailing_space),
    ]
    return KeepTogether(content)


story = [
    P('Claudia Ochoa', name_style),
    P('AI EXPERIENCE  |  PRODUCT DESIGN  |  BRAND STRATEGY', title_style),
    P(
        '<link href="https://claudiaochoa.co" color="#FFFFFF">claudiaochoa.co</link>'
        '  |  <link href="https://www.linkedin.com/in/claudiajochoa/" color="#FFFFFF">linkedin.com/in/claudiajochoa</link>',
        contact_style,
    ),
    *section('Leadership Profile'),
    P(
        'AI experience and product design leader with 20+ years of experience connecting emerging technology, '
        'business strategy, brand, and human-centered design. Sets product direction, turns ambiguous problems into '
        'clear experiences, and aligns leaders, designers, product managers, and engineers through delivery. Work spans '
        'enterprise platforms, consumer e-commerce, design systems, and responsible AI.',
        summary_style,
    ),
    Spacer(1, 4),
]

impact_data = [[
    [P('0 to 16', impact_number_style), P('Built Walmart People Product &amp; Design team', impact_label_style)],
    [P('24 hours', impact_number_style), P('Created GenAI hiring vision that earned executive support', impact_label_style)],
    [P('30 participants', impact_number_style), P('Validated Home Depot gift-card redesign before launch', impact_label_style)],
]]
impact_table = Table(impact_data, colWidths=[story_width := (letter[0] - 2 * 0.3 * inch) / 3] * 3)
impact_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
]))
story.extend([
    impact_table,
    *section('Core Expertise'),
    P(
        'AI product and experience strategy  |  Human-centered and responsible AI  |  Product vision and roadmaps  |  '
        'Design organization leadership  |  Enterprise UX and e-commerce  |  Research and usability testing  |  '
        'Design systems and accessibility  |  Executive storytelling  |  Prototyping and front-end delivery',
        small_style,
    ),
    *section('Professional Experience'),
    role(
        'Senior User Experience Designer / Interim Design Manager',
        'Walmart',
        'July 2024 - May 2025',
        'Led design across internal People products, team formation, and AI-enabled candidate experiences.',
        [
            'Scaled the People Product &amp; Design team from 0 to 16 full-time hires; managed contractors and established hiring, onboarding, and team practices.',
            'Served as interim design manager, mentoring designers and aligning resources, delivery, and career development with business priorities.',
            'Designed an end-to-end conversational GenAI candidate experience in 24 hours; earned executive approval and was positioned as Creative Director for the broader initiative.',
            'Led a 0-to-1 hiring dashboard within Me@Campus that was prioritized as a foundation for Walmart\'s hiring and recruiting modernization roadmap.',
            'Partnered with product managers on roadmaps, priorities, resourcing, and delivery; introduced faster AI-assisted prototyping through team workshops.',
        ],
    ),
    role(
        'Senior User Experience Designer',
        'The Home Depot',
        'November 2019 - April 2024',
        'Owned enterprise and customer-facing product design across complex, cross-functional initiatives.',
        [
            'Led a research-driven gift-card redesign across discovery, card selection, mixed-cart checkout, and balance management; tested with 30 participants, approved, and launched.',
            'Led the Military Discount initiative from concept through delivery, aligning executive leadership around an experience supporting veterans and military families.',
            'Combined interviews, usability testing, Google Analytics, and Quantum Metric insights to prioritize improvements and validate design decisions.',
            'Shaped design-system standards and product roadmaps across agile delivery teams.',
        ],
    ),
    PageBreak(),
    P('Claudia Ochoa', ParagraphStyle('PageName', parent=name_style, fontSize=17, leading=19, spaceAfter=2)),
    P('AI EXPERIENCE  |  PRODUCT DESIGN  |  BRAND STRATEGY', ParagraphStyle('PageTitle', parent=title_style, fontSize=8.2, spaceAfter=9)),
    *section('Professional Experience - Continued'),
    role(
        'Senior User Interface Designer',
        'Dell',
        'August 2018 - June 2019',
        'Designed a global enterprise shipment-tracking experience that made complex logistics data easier for business customers to act on.',
        [
            'Partnered with UX architects, product stakeholders, and customers to align workflows, interaction design, and operational needs.',
            'Synthesized customer interviews into simplified information architecture, modernized interface patterns, and clearer task flows.',
            'Delivered high-fidelity prototypes and implementation-ready specifications in close partnership with engineering.',
        ],
    ),
    role(
        'Founder &amp; Product Lead',
        'Nebulae',
        'October 2016 - August 2018',
        'Founded and launched a web-based platform, leading product, experience, brand, and go-to-market execution.',
        [
            'Defined the product vision and roadmap, turning an initial concept into a market-ready MVP.',
            'Led end-to-end UX, research, front-end delivery, vendors, and timelines through launch and iterative improvement.',
            'Directed cross-channel creative for digital campaigns, social media, sponsorship activations, and music-festival experiences.',
        ],
    ),
    role(
        'Senior Art Director',
        'Workday',
        'July 2012 - October 2016',
        'Led digital brand initiatives that modernized Workday\'s online presence during rapid growth leading and post IPO.',
        [
            'Led Workday.com\'s first responsive, mobile-first redesign at the Creative Director\'s request.',
            'Led creative direction for Workday Rising across event identity, digital experiences, microsites, and environmental design.',
            'Aligned executives, marketing teams, designers, agencies, and delivery partners around cohesive high-visibility experiences.',
            'Mentored designers while remaining hands-on in execution and quality review.',
        ],
    ),
    *section('Earlier Leadership Experience'),
    P('<font color="#FFFFFF"><b>VMware</b></font> - Art Director, Brand &amp; Marketing Web Design  |  2011 - 2012', small_style),
    P('<font color="#FFFFFF"><b>Salesforce</b></font> - Visual Designer, Dreamforce Identity &amp; Web  |  2010 - 2011', small_style),
    P('<font color="#FFFFFF"><b>Bio-Rad</b></font> - Interactive Designer, Data Visualization &amp; UX  |  2009 - 2010', small_style),
    P('<font color="#FFFFFF"><b>RedEnvelope</b></font> - Design Manager, E-commerce UX &amp; Brand  |  2005 - 2008', small_style),
    *section('Education'),
    P('<font color="#FFFFFF"><b>Juris Doctor studies</b></font>, Purdue Global Law School  |  In progress', small_style),
    P('<font color="#FFFFFF"><b>Master of Business Administration</b></font>, Purdue University Global  |  2026', small_style),
    P('<font color="#FFFFFF"><b>Bachelor of Fine Arts, Communication Design</b></font>, Texas State University  |  2003', small_style),
    *section('Selected Independent Work'),
    P(
        '<font color="#FFFFFF"><b>Lovesac customer experience redesign</b></font>  |  2026<br/>'
        'Created a live e-commerce redesign and six-part case study spanning research, information architecture, '
        'content strategy, accessibility, performance, AI readiness, and front-end development.  '
        '<link href="https://claudiaochoa.co/work/lovesac-case-study.html" color="#999999">View case study</link>',
        small_style,
    ),
])

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
ResumeDoc(str(OUTPUT)).build(story)
print(OUTPUT)
