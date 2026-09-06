from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'output/pdf/Claudia_Ochoa_Resume.pdf'

BACKGROUND = colors.HexColor('#121212')
PRIMARY = colors.HexColor('#F4F4F4')
SECONDARY = colors.HexColor('#99999F')
RULE = colors.HexColor('#303034')

pdfmetrics.registerFont(TTFont('Georgia', '/System/Library/Fonts/Supplemental/Georgia.ttf'))
pdfmetrics.registerFont(TTFont('Georgia-Bold', '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'))
pdfmetrics.registerFont(TTFont('Georgia-Italic', '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'))
pdfmetrics.registerFont(TTFont('Arial', '/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold', '/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Italic', '/System/Library/Fonts/Supplemental/Arial Italic.ttf'))
pdfmetrics.registerFont(TTFont('Fraunces', str(Path(__file__).parent / 'fonts/Fraunces-Regular.ttf')))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='Arial-Bold', italic='Arial-Italic')
pdfmetrics.registerFontFamily('Georgia', normal='Georgia', bold='Georgia-Bold', italic='Georgia-Italic')


class ResumeDoc(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(
            filename,
            pagesize=letter,
            leftMargin=20,
            rightMargin=20,
            topMargin=18,
            bottomMargin=36,
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


class OpticallyCenteredImpactTable(Table):
    def drawOn(self, canvas, x, y, _sW=0):
        return super().drawOn(canvas, x - 16, y, _sW)


def draw_page(canvas: Canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(BACKGROUND)
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    canvas.setStrokeColor(RULE)
    canvas.line(doc.leftMargin, 31, width - doc.rightMargin, 31)
    canvas.setFont('Arial', 8.2)
    canvas.setFillColor(SECONDARY)
    canvas.drawString(doc.leftMargin, 15, 'claudiaochoa.co | linkedin.com/in/claudiajochoa')
    canvas.drawRightString(width - doc.rightMargin, 15, str(doc.page))
    canvas.restoreState()


styles = getSampleStyleSheet()
name_style = ParagraphStyle(
    'Name', fontName='Arial-Bold', fontSize=13.2, leading=16, textColor=PRIMARY, spaceAfter=4
)
title_style = ParagraphStyle(
    'Title', fontName='Arial', fontSize=8.5, leading=11, textColor=PRIMARY,
    spaceAfter=6
)
contact_style = ParagraphStyle(
    'Contact', fontName='Arial', fontSize=8.8, leading=11, textColor=PRIMARY, spaceAfter=13
)
section_style = ParagraphStyle(
    'Section', fontName='Arial-Bold', fontSize=9.2, leading=11.5, textColor=PRIMARY,
    spaceBefore=17, spaceAfter=9
)
first_section_style = ParagraphStyle(
    'FirstSection', parent=section_style, spaceBefore=0
)
summary_style = ParagraphStyle(
    'Summary', fontName='Arial', fontSize=10.1, leading=15.2, textColor=SECONDARY, spaceAfter=7
)
role_style = ParagraphStyle(
    'Role', fontName='Georgia', fontSize=12.4, leading=15, textColor=PRIMARY, spaceAfter=2.5
)
company_style = ParagraphStyle(
    'Company', fontName='Arial', fontSize=10, leading=13, textColor=SECONDARY, spaceAfter=7
)
body_style = ParagraphStyle(
    'Body', fontName='Arial', fontSize=10.2, leading=14.8, textColor=SECONDARY, spaceAfter=7
)
bullet_style = ParagraphStyle(
    'Bullet', fontName='Arial', fontSize=10, leading=14.7, textColor=SECONDARY,
    leftIndent=13, firstLineIndent=0, bulletIndent=5,
    bulletFontName='Arial', bulletFontSize=10, spaceAfter=1.5
)
small_style = ParagraphStyle(
    'Small', fontName='Arial', fontSize=9.6, leading=14.1, textColor=SECONDARY, spaceAfter=0
)
impact_number_style = ParagraphStyle(
    'ImpactNumber', fontName='Georgia', fontSize=18, leading=21, textColor=PRIMARY,
    alignment=TA_CENTER, spaceAfter=6
)
impact_label_style = ParagraphStyle(
    'ImpactLabel', fontName='Arial', fontSize=8.3, leading=11, textColor=SECONDARY,
    alignment=TA_CENTER
)


def P(text, style):
    return Paragraph(text, style)


def section(title, first=False):
    return [P(title.upper(), first_section_style if first else section_style)]


def bullets(items):
    return [Paragraph(item, bullet_style, bulletText='•') for item in items]


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
    P('AI EXPERIENCE | PRODUCT DESIGN | BRAND STRATEGY', title_style),
    P(
        '<link href="https://claudiaochoa.co" color="#F4F4F4">claudiaochoa.co</link>'
        ' | <link href="https://www.linkedin.com/in/claudiajochoa/" color="#F4F4F4">linkedin.com/in/claudiajochoa</link>',
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
    Spacer(1, 5),
]

impact_data = [[
    [P('0 to 16', impact_number_style), P('Built Walmart People<br/>Product &amp; Design team', impact_label_style)],
    [P('24 hours', impact_number_style), P('Created GenAI hiring vision that earned executive support', impact_label_style)],
    [P('30 participants', impact_number_style), P('Validated Home Depot gift-card redesign before launch', impact_label_style)],
]]
impact_table = OpticallyCenteredImpactTable(
    impact_data,
    colWidths=[story_width := (letter[0] - 40) / 3] * 3,
)
impact_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
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
    *section('Professional Experience - Continued', first=True),
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
    P('<font name="Fraunces" color="#FFFFFF">VMware</font> - Art Director, Brand &amp; Marketing Web Design  |  <i>2011 - 2012</i>', small_style),
    P('<font name="Fraunces" color="#FFFFFF">Salesforce</font> - Visual Designer, Dreamforce Identity &amp; Web  |  <i>2010 - 2011</i>', small_style),
    P('<font name="Fraunces" color="#FFFFFF">Bio-Rad</font> - Interactive Designer, Data Visualization &amp; UX  |  <i>2009 - 2010</i>', small_style),
    P('<font name="Fraunces" color="#FFFFFF">RedEnvelope</font> - Design Manager, E-commerce UX &amp; Brand  |  <i>2005 - 2008</i>', small_style),
    *section('Education'),
    P('<font name="Fraunces" color="#FFFFFF">Juris Doctor studies</font>, Purdue Global Law School  |  <i>In progress</i>', small_style),
    P('<font name="Fraunces" color="#FFFFFF">Master of Business Administration</font>, Purdue University Global  |  <i>2026</i>', small_style),
    P('<font name="Fraunces" color="#FFFFFF">Bachelor of Fine Arts, Communication Design</font>, Texas State University  |  <i>2003</i>', small_style),
    *section('Selected Independent Work'),
    P(
        '<font name="Fraunces" color="#FFFFFF">Lovesac customer experience redesign</font>  |  <i>2026</i><br/>'
        'Created a live e-commerce redesign and six-part case study spanning research, information architecture, '
        'content strategy, accessibility, performance, AI readiness, and front-end development.  '
        '<link href="https://claudiaochoa.co/work/lovesac-case-study.html" color="#999999">View case study</link>',
        small_style,
    ),
])

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
ResumeDoc(str(OUTPUT)).build(story)
print(OUTPUT)
