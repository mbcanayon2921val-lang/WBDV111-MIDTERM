const STORAGE_KEY = "ledgerFlowState";

const defaultState = {
    clients: [
        { id: "CL-100", name: "Northwind Trading Co.", email: "billing@northwindco.com", industry: "Retail" },
        { id: "CL-101", name: "Summit Studio", email: "finance@summitstudio.io", industry: "Design" },
        { id: "CL-102", name: "Harbor Health Group", email: "accounts@harborhealth.org", industry: "Healthcare" },
        { id: "CL-103", name: "Aster Lane Properties", email: "ops@asterlane.com", industry: "Real Estate" }
    ],
    invoices: [
        { id: "INV-2401", clientId: "CL-100", amount: 2400, issuedDate: "2026-03-02", dueDate: "2026-03-18", status: "Overdue", notes: "March merchandising support", link: "https://ledgerflow.app/i/inv-2401" },
        { id: "INV-2402", clientId: "CL-101", amount: 3150, issuedDate: "2026-03-06", dueDate: "2026-03-24", status: "Sent", notes: "Brand refresh milestone", link: "https://ledgerflow.app/i/inv-2402" },
        { id: "INV-2403", clientId: "CL-102", amount: 1850, issuedDate: "2026-03-08", dueDate: "2026-03-15", status: "Paid", notes: "Landing page audit", link: "https://ledgerflow.app/i/inv-2403" },
        { id: "INV-2404", clientId: "CL-103", amount: 4200, issuedDate: "2026-03-11", dueDate: "2026-03-29", status: "Draft", notes: "Leasing portal sprint", link: "https://ledgerflow.app/i/inv-2404" },
        { id: "INV-2405", clientId: "CL-100", amount: 950, issuedDate: "2026-03-14", dueDate: "2026-03-26", status: "Sent", notes: "Ad hoc revisions", link: "https://ledgerflow.app/i/inv-2405" }
    ]
};

let state = loadState();

function loadState() {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (parsed?.clients && parsed?.invoices) {
            return parsed;
        }
    } catch {}
    return structuredClone(defaultState);
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getClient(clientId) {
    return state.clients.find(client => client.id === clientId);
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatDate(dateString) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(dateString));
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}

function computeInvoiceStatus(invoice) {
    if (invoice.status === "Paid") {
        return "Paid";
    }
    if (invoice.status === "Draft") {
        return "Draft";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(invoice.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today ? "Overdue" : "Sent";
}

function invoiceWithComputedStatus(invoice) {
    return { ...invoice, status: computeInvoiceStatus(invoice) };
}

function getMetrics() {
    const invoices = state.invoices.map(invoiceWithComputedStatus);
    const collected = invoices.filter(invoice => invoice.status === "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
    const outstanding = invoices.filter(invoice => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
    const overdue = invoices.filter(invoice => invoice.status === "Overdue").reduce((sum, invoice) => sum + invoice.amount, 0);
    return {
        activeClients: state.clients.length,
        openInvoices: invoices.filter(invoice => invoice.status !== "Paid").length,
        collected,
        outstanding,
        overdue
    };
}

function statusClass(status) {
    return `status-pill status-${status.toLowerCase()}`;
}

function buildInvoiceRow(invoice) {
    const client = getClient(invoice.clientId);
    return `
        <tr>
            <td>
                <div class="row-title">${escapeHtml(invoice.id)}</div>
                <div class="tiny">${escapeHtml(invoice.notes || "Standard invoice")}</div>
            </td>
            <td>${escapeHtml(client?.name || "Unknown client")}</td>
            <td>${formatDate(invoice.issuedDate)}</td>
            <td>${formatDate(invoice.dueDate)}</td>
            <td><span class="${statusClass(invoice.status)}">${escapeHtml(invoice.status)}</span></td>
            <td>${formatCurrency(invoice.amount)}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn" data-action="copy-link" data-id="${escapeHtml(invoice.id)}">Copy Link</button>
                    <button class="action-btn" data-action="download-pdf" data-id="${escapeHtml(invoice.id)}">PDF</button>
                    <button class="action-btn primary" data-action="mark-paid" data-id="${escapeHtml(invoice.id)}">Mark Paid</button>
                </div>
            </td>
        </tr>
    `;
}

function buildClientRow(client) {
    const invoices = state.invoices
        .map(invoiceWithComputedStatus)
        .filter(invoice => invoice.clientId === client.id && invoice.status !== "Paid");
    const outstanding = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

    return `
        <tr>
            <td class="row-title">${escapeHtml(client.name)}</td>
            <td>${escapeHtml(client.email)}</td>
            <td>${escapeHtml(client.industry)}</td>
            <td>${invoices.length}</td>
            <td>${formatCurrency(outstanding)}</td>
            <td>
                <div class="table-actions">
                    <a class="action-btn" href="cakes.html">Invoice</a>
                    <button class="action-btn" data-action="copy-email" data-id="${escapeHtml(client.id)}">Copy Email</button>
                </div>
            </td>
        </tr>
    `;
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) {
        return;
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyText(text, successMessage) {
    try {
        await navigator.clipboard.writeText(text);
        showToast(successMessage);
    } catch {
        showToast("Clipboard access was blocked in this browser.");
    }
}

function downloadInvoiceSummary(invoiceId) {
    const invoice = state.invoices.map(invoiceWithComputedStatus).find(entry => entry.id === invoiceId);
    if (!invoice) {
        return;
    }
    const client = getClient(invoice.clientId);
    const content = [
        "LedgerFlow Invoice Summary",
        `Invoice: ${invoice.id}`,
        `Client: ${client?.name || "Unknown client"}`,
        `Amount: ${formatCurrency(invoice.amount)}`,
        `Issued: ${formatDate(invoice.issuedDate)}`,
        `Due: ${formatDate(invoice.dueDate)}`,
        `Status: ${invoice.status}`,
        `Notes: ${invoice.notes || "n/a"}`,
        `Link: ${invoice.link}`
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${invoice.id}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast(`${invoice.id} export downloaded.`);
}

function markInvoicePaid(invoiceId) {
    const invoice = state.invoices.find(entry => entry.id === invoiceId);
    if (!invoice) {
        return;
    }
    invoice.status = "Paid";
    saveState();
    initializePage();
    showToast(`${invoiceId} marked as paid.`);
}

function populateClientSelect() {
    const select = document.getElementById("client-select");
    if (!select) {
        return;
    }
    select.innerHTML = state.clients
        .map(client => `<option value="${escapeHtml(client.id)}">${escapeHtml(client.name)}</option>`)
        .join("");
}

function createInvoice(event) {
    event.preventDefault();

    const selectedClientId = document.getElementById("client-select")?.value;
    const newClientName = document.getElementById("new-client")?.value.trim();
    const amountValue = Number(document.getElementById("invoice-amount")?.value);
    const dueDate = document.getElementById("invoice-due-date")?.value;
    const notes = document.getElementById("invoice-notes")?.value.trim();

    if (!amountValue || !dueDate) {
        showToast("Add an amount and due date first.");
        return;
    }

    let clientId = selectedClientId;
    if (newClientName) {
        clientId = `CL-${Date.now().toString().slice(-4)}`;
        state.clients.unshift({
            id: clientId,
            name: newClientName,
            email: `billing@${newClientName.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`,
            industry: "New Client"
        });
    }

    if (!clientId) {
        showToast("Choose or create a client.");
        return;
    }

    const sequence = 2400 + state.invoices.length + 1;
    const invoiceId = `INV-${sequence}`;
    state.invoices.unshift({
        id: invoiceId,
        clientId,
        amount: amountValue,
        issuedDate: new Date().toISOString().slice(0, 10),
        dueDate,
        status: "Draft",
        notes: notes || "New invoice draft",
        link: `https://ledgerflow.app/i/${invoiceId.toLowerCase()}`
    });

    saveState();
    event.target.reset();
    populateClientSelect();
    initializePage();
    showToast(`${invoiceId} created.`);
}

function renderDashboard() {
    const metrics = getMetrics();
    const heroMetrics = document.getElementById("hero-metrics");
    const dashboardMetrics = document.getElementById("dashboard-metrics");
    const dashboardInvoices = document.getElementById("dashboard-invoices");
    const dashboardClients = document.getElementById("dashboard-clients");

    if (heroMetrics) {
        heroMetrics.innerHTML = `
            <div class="stat-tile"><span class="tiny">Open invoices</span><strong>${metrics.openInvoices}</strong></div>
            <div class="stat-tile"><span class="tiny">Outstanding</span><strong>${formatCurrency(metrics.outstanding)}</strong></div>
            <div class="stat-tile"><span class="tiny">Collected</span><strong>${formatCurrency(metrics.collected)}</strong></div>
            <div class="stat-tile"><span class="tiny">Clients</span><strong>${metrics.activeClients}</strong></div>
        `;
    }

    if (dashboardMetrics) {
        dashboardMetrics.innerHTML = `
            <article class="card metric-card"><p>Outstanding balance</p><strong>${formatCurrency(metrics.outstanding)}</strong></article>
            <article class="card metric-card"><p>Collected this cycle</p><strong>${formatCurrency(metrics.collected)}</strong></article>
            <article class="card metric-card"><p>Overdue invoices</p><strong>${state.invoices.map(invoiceWithComputedStatus).filter(invoice => invoice.status === "Overdue").length}</strong></article>
            <article class="card metric-card"><p>Active clients</p><strong>${metrics.activeClients}</strong></article>
        `;
    }

    if (dashboardInvoices) {
        dashboardInvoices.innerHTML = state.invoices
            .map(invoiceWithComputedStatus)
            .slice(0, 4)
            .map(invoice => `
                <tr>
                    <td class="row-title">${escapeHtml(invoice.id)}</td>
                    <td>${escapeHtml(getClient(invoice.clientId)?.name || "Unknown client")}</td>
                    <td>${formatDate(invoice.dueDate)}</td>
                    <td><span class="${statusClass(invoice.status)}">${escapeHtml(invoice.status)}</span></td>
                    <td>${formatCurrency(invoice.amount)}</td>
                    <td>
                        <div class="table-actions">
                            <a class="action-btn" href="cakes.html">Open</a>
                            <button class="action-btn" data-action="copy-link" data-id="${escapeHtml(invoice.id)}">Copy Link</button>
                        </div>
                    </td>
                </tr>
            `)
            .join("");
    }

    if (dashboardClients) {
        dashboardClients.innerHTML = state.clients.slice(0, 3).map(client => {
            const openInvoices = state.invoices
                .map(invoiceWithComputedStatus)
                .filter(invoice => invoice.clientId === client.id && invoice.status !== "Paid");
            return `
                <div class="client-card">
                    <strong>${escapeHtml(client.name)}</strong>
                    <div class="tiny">${escapeHtml(client.email)}</div>
                    <div class="tiny">${openInvoices.length} open invoice(s)</div>
                </div>
            `;
        }).join("");
    }
}

function renderInvoices() {
    populateClientSelect();

    const searchValue = document.getElementById("invoice-search")?.value.trim().toLowerCase() || "";
    const statusValue = document.getElementById("invoice-status-filter")?.value || "all";
    const body = document.getElementById("invoice-table-body");
    if (!body) {
        return;
    }

    const filtered = state.invoices
        .map(invoiceWithComputedStatus)
        .filter(invoice => {
            const client = getClient(invoice.clientId);
            const textMatch = !searchValue
                || invoice.id.toLowerCase().includes(searchValue)
                || (client?.name || "").toLowerCase().includes(searchValue);
            const statusMatch = statusValue === "all" || invoice.status === statusValue;
            return textMatch && statusMatch;
        });

    body.innerHTML = filtered.map(buildInvoiceRow).join("") || `
        <tr><td colspan="7">No invoices matched that filter.</td></tr>
    `;
}

function renderClients() {
    const metrics = getMetrics();
    const metricsContainer = document.getElementById("client-metrics");
    const body = document.getElementById("client-table-body");
    const searchValue = document.getElementById("client-search")?.value.trim().toLowerCase() || "";

    if (metricsContainer) {
        metricsContainer.innerHTML = `
            <article class="card metric-card"><p>Total clients</p><strong>${metrics.activeClients}</strong></article>
            <article class="card metric-card"><p>Clients with open invoices</p><strong>${state.clients.filter(client => state.invoices.map(invoiceWithComputedStatus).some(invoice => invoice.clientId === client.id && invoice.status !== "Paid")).length}</strong></article>
            <article class="card metric-card"><p>Outstanding across clients</p><strong>${formatCurrency(metrics.outstanding)}</strong></article>
            <article class="card metric-card"><p>Overdue balance</p><strong>${formatCurrency(metrics.overdue)}</strong></article>
        `;
    }

    if (!body) {
        return;
    }

    body.innerHTML = state.clients
        .filter(client => !searchValue || client.name.toLowerCase().includes(searchValue) || client.email.toLowerCase().includes(searchValue))
        .map(buildClientRow)
        .join("") || `<tr><td colspan="6">No clients matched that search.</td></tr>`;
}

function renderReports() {
    const metrics = getMetrics();
    const metricsContainer = document.getElementById("report-metrics");
    const revenueBreakdown = document.getElementById("revenue-breakdown");
    const linkList = document.getElementById("link-list");
    const tableBody = document.getElementById("report-table-body");
    const invoices = state.invoices.map(invoiceWithComputedStatus);

    if (metricsContainer) {
        metricsContainer.innerHTML = `
            <article class="card metric-card"><p>Total invoiced</p><strong>${formatCurrency(invoices.reduce((sum, invoice) => sum + invoice.amount, 0))}</strong></article>
            <article class="card metric-card"><p>Paid invoices</p><strong>${invoices.filter(invoice => invoice.status === "Paid").length}</strong></article>
            <article class="card metric-card"><p>Pending collection</p><strong>${formatCurrency(metrics.outstanding)}</strong></article>
            <article class="card metric-card"><p>Overdue amount</p><strong>${formatCurrency(metrics.overdue)}</strong></article>
        `;
    }

    if (revenueBreakdown) {
        const draft = invoices.filter(invoice => invoice.status === "Draft").reduce((sum, invoice) => sum + invoice.amount, 0);
        const sent = invoices.filter(invoice => invoice.status === "Sent").reduce((sum, invoice) => sum + invoice.amount, 0);
        const paid = invoices.filter(invoice => invoice.status === "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
        const overdue = invoices.filter(invoice => invoice.status === "Overdue").reduce((sum, invoice) => sum + invoice.amount, 0);
        revenueBreakdown.innerHTML = `
            <div class="report-card"><strong>Draft invoices</strong><span class="tiny">${formatCurrency(draft)}</span></div>
            <div class="report-card"><strong>Sent invoices</strong><span class="tiny">${formatCurrency(sent)}</span></div>
            <div class="report-card"><strong>Paid invoices</strong><span class="tiny">${formatCurrency(paid)}</span></div>
            <div class="report-card"><strong>Overdue invoices</strong><span class="tiny">${formatCurrency(overdue)}</span></div>
        `;
    }

    if (linkList) {
        linkList.innerHTML = invoices.slice(0, 4).map(invoice => `
            <div class="report-card">
                <strong>${escapeHtml(invoice.id)}</strong>
                <span class="tiny">${escapeHtml(invoice.link)}</span>
            </div>
        `).join("");
    }

    if (tableBody) {
        tableBody.innerHTML = invoices.map(invoice => `
            <tr>
                <td class="row-title">${escapeHtml(invoice.id)}</td>
                <td>${escapeHtml(getClient(invoice.clientId)?.name || "Unknown client")}</td>
                <td><span class="${statusClass(invoice.status)}">${escapeHtml(invoice.status)}</span></td>
                <td>${formatCurrency(invoice.amount)}</td>
                <td><span class="tiny">${escapeHtml(invoice.link)}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" data-action="copy-link" data-id="${escapeHtml(invoice.id)}">Copy Link</button>
                        <button class="action-btn" data-action="download-pdf" data-id="${escapeHtml(invoice.id)}">PDF</button>
                    </div>
                </td>
            </tr>
        `).join("");
    }
}

function bindPageEvents() {
    document.getElementById("invoice-form")?.addEventListener("submit", createInvoice);
    document.getElementById("invoice-search")?.addEventListener("input", renderInvoices);
    document.getElementById("invoice-status-filter")?.addEventListener("change", renderInvoices);
    document.getElementById("client-search")?.addEventListener("input", renderClients);

    document.body.addEventListener("click", event => {
        const target = event.target.closest("[data-action]");
        if (!target) {
            return;
        }

        const { action, id } = target.dataset;

        if (action === "copy-link") {
            const invoice = state.invoices.find(entry => entry.id === id);
            if (invoice) {
                copyText(invoice.link, `${id} link copied.`);
            }
        }

        if (action === "download-pdf") {
            downloadInvoiceSummary(id);
        }

        if (action === "mark-paid") {
            markInvoicePaid(id);
        }

        if (action === "copy-email") {
            const client = state.clients.find(entry => entry.id === id);
            if (client) {
                copyText(client.email, `${client.name} email copied.`);
            }
        }
    });
}

function initializePage() {
    state = loadState();
    const page = document.body.dataset.page;

    if (page === "dashboard") {
        renderDashboard();
    }
    if (page === "invoices") {
        renderInvoices();
    }
    if (page === "clients") {
        renderClients();
    }
    if (page === "reports") {
        renderReports();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    bindPageEvents();
    initializePage();
});
