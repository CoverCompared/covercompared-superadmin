import React from "react";

import async from "../components/Async";

import {
  BookOpen,
  Briefcase,
  Calendar as CalendarIcon,
  CheckSquare,
  CreditCard,
  Grid,
  Heart,
  Layout,
  List,
  Map,
  Monitor,
  PieChart,
  Sliders,
  User,
  Users,
  Settings as SettingsIcon
} from "react-feather";
import { ContactMail, DescriptionOutlined, Notifications, SentimentDissatisfiedOutlined, VerticalSplit } from "@material-ui/icons";
import MSOIcon from "../assets/mso.svg";

const HomePage = async(() => import("../pages/HomePage"));
const Settings = async(() => import("../pages/Settings"));
const ForgotPassword = async(() => import("../pages/ForgotPassword"));
const ContactUsList = async(() => import("../pages/ContactUs/ContactUsList"));
const SubscriptionList = async(() => import("../pages/Subscription/SubscriptionList"));
const PolicyRequest = async(() => import("../pages/PolicyRequest/PolicyRequest"));
const BlogsList = async(() => import("../pages/Blogs/BlogList"));
const BlogShow = async(() => import("../pages/Blogs/BlogShow"));
const BlogCreate = async(() => import("../pages/Blogs/BlogCreate"));
const BlogUpdate = async(() => import("../pages/Blogs/BlogUpdate"));
const CoverList = async(() => import("../pages/Covers/CoverList"));
const CoverShow = async(() => import("../pages/Covers/CoverShow"));
const MSOPoliciesList = async(() => import("../pages/MSOPolicies/MSOPoliciesList"));

// Auth components
const SignIn = async(() => import("../pages/auth/SignIn"));
const Login = async(() => import("../pages/Login"));
const SignUp = async(() => import("../pages/auth/SignUp"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));
const Page404 = async(() => import("../pages/auth/Page404"));
const Page500 = async(() => import("../pages/auth/Page500"));

// Components components
const Avatars = async(() => import("../pages/components/Avatars"));
const Badges = async(() => import("../pages/components/Badges"));
const Buttons = async(() => import("../pages/components/Buttons"));
const Cards = async(() => import("../pages/components/Cards"));
const Chips = async(() => import("../pages/components/Chips"));
const Dialogs = async(() => import("../pages/components/Dialogs"));
const ExpPanels = async(() => import("../pages/components/ExpansionPanels"));
const Lists = async(() => import("../pages/components/Lists"));
const Menus = async(() => import("../pages/components/Menus"));
const Progress = async(() => import("../pages/components/Progress"));
const Snackbars = async(() => import("../pages/components/Snackbars"));
const Tooltips = async(() => import("../pages/components/Tooltips"));

// Dashboards components
const Default = async(() => import("../pages/dashboards/Default"));
const Analytics = async(() => import("../pages/dashboards/Analytics"));

// Forms components
const Pickers = async(() => import("../pages/forms/Pickers"));
const SelectionCtrls = async(() => import("../pages/forms/SelectionControls"));
const Selects = async(() => import("../pages/forms/Selects"));
const TextFields = async(() => import("../pages/forms/TextFields"));

// Icons components
const MaterialIcons = async(() => import("../pages/icons/MaterialIcons"));
const FeatherIcons = async(() => import("../pages/icons/FeatherIcons"));

// Pages components
const Blank = async(() => import("../pages/pages/Blank"));
const Invoice = async(() => import("../pages/pages/Invoice"));
const Pricing = async(() => import("../pages/pages/Pricing"));
const Profile = async(() => import("../pages/pages/Profile"));
const PageSettings = async(() => import("../pages/pages/Settings"));
const Tasks = async(() => import("../pages/pages/Tasks"));
const Projects = async(() => import("../pages/pages/Projects"));
const Calendar = async(() => import("../pages/pages/Calendar"));

// Tables components
const SimpleTable = async(() => import("../pages/tables/SimpleTable"));
const AdvancedTable = async(() => import("../pages/tables/AdvancedTable"));

// Chart components
const Chartjs = async(() => import("../pages/charts/Chartjs"));

// Maps components
const GoogleMaps = async(() => import("../pages/maps/GoogleMaps"));
const VectorMaps = async(() => import("../pages/maps/VectorMaps"));

const dashboardsRoutes = {
  id: "Dashboard",
  path: "/",
  header: "",
  icon: <Sliders />,
  containsHome: true,
  component: HomePage
};

const contactUsRoutes = {
  id: "Contact Us",
  path: "/contact-us",
  exactMatch: false,
  icon: <ContactMail />,
  component: ContactUsList
};

const subscriptionRoutes = {
  id: "Subscription",
  path: "/subscription",
  exactMatch: false,
  icon: <Notifications />,
  component: SubscriptionList
};

const policyRequest = {
  id: "Policy Request",
  path: "/policy-request",
  exactMatch: false,
  icon: <SentimentDissatisfiedOutlined />,
  component: PolicyRequest
};

const blogsRoutes = {
  id: "Blogs",
  path: "/blogs",
  exactMatch: false,
  icon: <VerticalSplit />,
  component: BlogsList
};

const blogShowRoutes = {
  id: "Blogs",
  path: "/blogs/show/:id",
  exactMatch: false,
  icon: <VerticalSplit />,
  component: BlogShow
};


const coversRoutes = {
  id: "Covers",
  path: "/covers",
  exactMatch: false,
  icon: <DescriptionOutlined />,
  component: CoverList
};

const msoPoliciesRoutes = {
  id: "MSO Policies",
  path: "/mso-policies",
  exactMatch: false,
  icon: <img className="sidebar-icon" src={MSOIcon} />,
  component: MSOPoliciesList
};

const coverShowRoutes = {
  id: "Covers",
  path: "/covers/show/:id",
  exactMatch: false,
  icon: <DescriptionOutlined />,
  component: CoverShow
};

const blogCreateRoutes = {
  id: "Blogs",
  path: "/blogs/create",
  exactMatch: false,
  icon: <VerticalSplit />,
  component: BlogCreate
};

const blogUpdateRoutes = {
  id: "Blogs",
  path: "/blogs/edit/:id",
  exactMatch: false,
  icon: <VerticalSplit />,
  component: BlogUpdate
};


const pagesRoutes = {
  id: "Pages",
  path: "/pages",
  icon: <Layout />,
  children: [
    {
      path: "/pages/settings",
      name: "Settings",
      component: PageSettings
    },
    {
      path: "/pages/pricing",
      name: "Pricing",
      component: Pricing
    },
    {
      path: "/pages/blank",
      name: "Blank Page",
      component: Blank
    }
  ]
};

const profileRoutes = {
  id: "Profile",
  path: "/profile",
  icon: <User />,
  component: Profile,
  children: null
};

const projectsRoutes = {
  id: "Projects",
  path: "/projects",
  icon: <Briefcase />,
  badge: "8",
  component: Projects,
  children: null
};

const invoiceRoutes = {
  id: "Invoice",
  path: "/invoice",
  icon: <CreditCard />,
  component: Invoice,
  children: null
};

const tasksRoutes = {
  id: "Tasks",
  path: "/tasks",
  icon: <CheckSquare />,
  badge: "17",
  component: Tasks,
  children: null
};

const calendarRoutes = {
  id: "Calendar",
  path: "/calendar",
  icon: <CalendarIcon />,
  component: Calendar,
  children: null
};

const authRoutes = {
  id: "Auth",
  path: "/auth",
  icon: <Users />,
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp
    },
    {
      path: "/auth/reset-password",
      name: "Reset Password",
      component: ResetPassword
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500
    }
  ]
};

const componentsRoutes = {
  id: "Components",
  path: "/components",
  header: "Elements",
  icon: <Grid />,
  children: [
    {
      path: "/components/avatars",
      name: "Avatars",
      component: Avatars
    },
    {
      path: "/components/badges",
      name: "Badges",
      component: Badges
    },
    {
      path: "/components/buttons",
      name: "Buttons",
      component: Buttons
    },
    {
      path: "/components/cards",
      name: "Cards",
      component: Cards
    },
    {
      path: "/components/chips",
      name: "Chips",
      component: Chips
    },
    {
      path: "/components/dialogs",
      name: "Dialogs",
      component: Dialogs
    },
    {
      path: "/components/expansion-panels",
      name: "Expansion Panels",
      component: ExpPanels
    },
    {
      path: "/components/lists",
      name: "Lists",
      component: Lists
    },
    {
      path: "/components/menus",
      name: "Menus",
      component: Menus
    },
    {
      path: "/components/progress",
      name: "Progress",
      component: Progress
    },
    {
      path: "/components/snackbars",
      name: "Snackbars",
      component: Snackbars
    },
    {
      path: "/components/tooltips",
      name: "Tooltips",
      component: Tooltips
    }
  ]
};

const formsRoutes = {
  id: "Forms",
  path: "/forms",
  icon: <CheckSquare />,
  children: [
    {
      path: "/forms/pickers",
      name: "Pickers",
      component: Pickers
    },
    {
      path: "/forms/selection-controls",
      name: "Selection Controls",
      component: SelectionCtrls
    },
    {
      path: "/forms/selects",
      name: "Selects",
      component: Selects
    },
    {
      path: "/forms/text-fields",
      name: "Text Fields",
      component: TextFields
    }
  ]
};

const tablesRoutes = {
  id: "Tables",
  path: "/tables",
  icon: <List />,
  children: [
    {
      path: "/tables/simple-table",
      name: "Simple Table",
      component: SimpleTable
    },
    {
      path: "/tables/advanced-table",
      name: "Advanced Table",
      component: AdvancedTable
    }
  ]
};

const iconsRoutes = {
  id: "Icons",
  path: "/icons",
  icon: <Heart />,
  children: [
    {
      path: "/icons/material-icons",
      name: "Material Icons",
      component: MaterialIcons
    },
    {
      path: "/icons/feather-icons",
      name: "Feather Icons",
      component: FeatherIcons
    }
  ]
};

const chartRoutes = {
  id: "Charts",
  path: "/charts",
  icon: <PieChart />,
  component: Chartjs,
  children: null
};

const mapsRoutes = {
  id: "Maps",
  path: "/maps",
  icon: <Map />,
  children: [
    {
      path: "/maps/google-maps",
      name: "Google Maps",
      component: GoogleMaps
    },
    {
      path: "/maps/vector-maps",
      name: "Vector Maps",
      component: VectorMaps
    }
  ]
};

// This route is not visisble in the sidebar
const privateRoutes = {
  id: "Private",
  path: "/private",
  component: Blank,
  children: null
};

const loginRoute = {
  id: "Login",
  path: "/login",
  component: Login,
  children: null
}

const settingsRoute = {
  id: "Settings",
  path: "/settings",
  exactMatch: false,
  icon: <SettingsIcon />,
  component: Settings,
  children: null
}

const forgotPasswordRoute = {
  id: "ForgotPassword",
  path: "/forgot-password",
  component: ForgotPassword,
  children: null
}

export const dashboard = [
  dashboardsRoutes,
  settingsRoute,
  contactUsRoutes,
  subscriptionRoutes,
  policyRequest,
  blogsRoutes,
  blogShowRoutes,
  blogCreateRoutes,
  blogUpdateRoutes,
  coversRoutes,
  coverShowRoutes,
  msoPoliciesRoutes,
  pagesRoutes,
  profileRoutes,
  projectsRoutes,
  invoiceRoutes,
  tasksRoutes,
  calendarRoutes,
  componentsRoutes,
  chartRoutes,
  formsRoutes,
  tablesRoutes,
  iconsRoutes,
  mapsRoutes,
  privateRoutes
];

export const auth = [authRoutes];

export const unAuthRoutes = [loginRoute, forgotPasswordRoute,];

export default [
  dashboardsRoutes,
  coversRoutes,
  contactUsRoutes,
  subscriptionRoutes,
  policyRequest,
  blogsRoutes,
  msoPoliciesRoutes,
  settingsRoute
];
