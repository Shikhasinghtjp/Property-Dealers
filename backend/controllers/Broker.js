import  Broker  from '../models/Broker.js';

export const createBroker = async (req, res) => {
  try {
    const { name, email, phone, address, leadStatus, followup } = req.body;
    const existingBroker = await Broker.findOne({ where: { email } });

    if (existingBroker) {
      return res.status(400).json({ message: "Broker with this email already exists" });
    }

    const validLeadStatuses = ['Active', 'Inactive', 'Contacted', 'NotContacted', 'Unreachable'];
    const normalizedLeadStatus = leadStatus && validLeadStatuses.includes(leadStatus) ? leadStatus : 'NotContacted';
    const followupDate = followup ? new Date(followup) : null;

    const broker = await Broker.create({ name, email, phone, address, leadStatus: normalizedLeadStatus, followup: followupDate });
    res.status(201).json(broker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBrokers = async (req, res) => {
  try {
    const brokers = await Broker.findAll();
    res.json(brokers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBroker = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, leadStatus, followup } = req.body;
    const broker = await Broker.findByPk(id);
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    const validLeadStatuses = ['Active', 'Inactive', 'Contacted', 'NotContacted', 'Unreachable'];
    const normalizedLeadStatus = leadStatus && validLeadStatuses.includes(leadStatus) ? leadStatus : broker.leadStatus;
    const followupDate = followup ? new Date(followup) : broker.followup;

    await broker.update({ name, email, phone, address, leadStatus: normalizedLeadStatus, followup: followupDate });
    res.json(broker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBroker = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete broker with ID: ${id}`); // Debug log
    const broker = await Broker.findByPk(id);
    if (!broker) {
      console.log(`Broker with ID ${id} not found`); // Debug log
      return res.status(404).json({ message: 'Broker not found' });
    }
    await broker.destroy();
    console.log(`Broker with ID ${id} deleted successfully`); // Debug log
    res.json({ message: 'Broker deleted' });
  } catch (error) {
    console.error(`Error in deleteBroker: ${error.message}`); // Debug log
    res.status(500).json({ message: error.message });
  }
};
export default { createBroker, getBrokers, updateBroker, deleteBroker };